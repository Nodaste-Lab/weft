/**
 * Extract a component's PUBLIC prop surface from its `.tsx` source using the
 * TypeScript AST (parse-only — no type checker, so no tsconfig/React types
 * needed). This is the machine-extracted contract behind the Workstream B
 * version pins (D2): a committed snapshot of this surface, diffed on CI, is what
 * makes "a panel pinned to v1 renders unchanged" trustworthy.
 *
 * We capture the EXPLICIT contract authors depend on — the cva variant options
 * and the component's own declared props (incl. literal-union value sets) — not
 * the native element attribute spread (`ComponentProps<"button">`), which is
 * stable across versions and recorded only as an informational marker.
 *
 * Surface shape (deterministic, sorted):
 *   {
 *     variants: { [group]: string[] },                       // from cva, via VariantProps
 *     props:    { [name]: { optional: boolean, union: string[]|null } },
 *     native:   string[],                                    // e.g. ["button"] — informational
 *   }
 */
import ts from 'typescript';
import { readFileSync } from 'node:fs';

function propertyNames(objLiteral) {
  const names = [];
  for (const prop of objLiteral.properties) {
    if (prop.name && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name))) names.push(prop.name.text);
  }
  return names;
}

// `cva(base, { variants: { group: { key: ... } } })` -> { group: [keys] }
function extractCvaVariants(callExpr) {
  const variants = {};
  const config = callExpr.arguments[1];
  if (!config || !ts.isObjectLiteralExpression(config)) return variants;
  const variantsProp = config.properties.find(
    (p) => ts.isPropertyAssignment(p) && p.name && p.name.getText() === 'variants',
  );
  if (!variantsProp || !ts.isObjectLiteralExpression(variantsProp.initializer)) return variants;
  for (const group of variantsProp.initializer.properties) {
    if (ts.isPropertyAssignment(group) && group.name && ts.isObjectLiteralExpression(group.initializer)) {
      variants[group.name.getText()] = propertyNames(group.initializer).sort();
    }
  }
  return variants;
}

// Literal-union value set: "a" | "b" -> ["a","b"]; otherwise null.
function unionLiterals(typeNode) {
  if (!typeNode) return null;
  const lits = [];
  const collect = (n) => {
    if (ts.isUnionTypeNode(n)) { n.types.forEach(collect); return; }
    if (ts.isLiteralTypeNode(n) && ts.isStringLiteral(n.literal)) { lits.push(n.literal.text); return; }
    lits.push(null);
  };
  collect(typeNode);
  return lits.every((l) => typeof l === 'string') && lits.length ? lits.sort() : null;
}

// A node is either a TypeReferenceNode (in type position) or an
// ExpressionWithTypeArguments (in an `extends` heritage clause). Both carry a
// name + type arguments; normalize access so we never synthesize nodes.
const refName = (node) =>
  ts.isTypeReferenceNode(node) ? node.typeName.getText()
  : ts.isExpressionWithTypeArguments(node) ? node.expression.getText()
  : null;
const refArgs = (node) => node.typeArguments ?? [];

// String-literal type args after the first (the keys in Omit<T, "a" | "b">).
function omittedKeys(node) {
  const out = [];
  for (const a of refArgs(node).slice(1)) {
    if (ts.isLiteralTypeNode(a) && ts.isStringLiteral(a.literal)) out.push(a.literal.text);
    else if (ts.isUnionTypeNode(a)) for (const u of a.types) if (ts.isLiteralTypeNode(u) && ts.isStringLiteral(u.literal)) out.push(u.literal.text);
  }
  return out;
}

export function extractSurface(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const cva = {};            // const name -> { group: [keys] }
  const typeAliases = {};    // name -> TypeNode
  const interfaces = {};     // name -> InterfaceDeclaration
  const propTypeNodes = [];

  sf.forEachChild((node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        const init = decl.initializer;
        if (init && ts.isCallExpression(init) && ts.isIdentifier(init.expression) && init.expression.text === 'cva') {
          cva[decl.name.getText()] = extractCvaVariants(init);
        }
      }
    }
    if (ts.isTypeAliasDeclaration(node)) typeAliases[node.name.text] = node.type;
    if (ts.isInterfaceDeclaration(node)) interfaces[node.name.text] = node;
  });

  for (const [name, typeNode] of Object.entries(typeAliases)) if (/Props$/.test(name)) propTypeNodes.push(typeNode);
  for (const [name, decl] of Object.entries(interfaces)) if (/Props$/.test(name)) propTypeNodes.push(decl);

  // Inline param prop types: `function C({...}: <TYPE>)` / `const C = ({...}: <TYPE>) => ...`
  const collectInlineParamTypes = (node) => {
    if ((ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) && node.parameters.length) {
      const first = node.parameters[0];
      if (first && first.type && ts.isObjectBindingPattern(first.name)) propTypeNodes.push(first.type);
    }
    ts.forEachChild(node, collectInlineParamTypes);
  };
  collectInlineParamTypes(sf);

  const variants = {};
  const props = {};
  const native = new Set();
  const seenAlias = new Set();

  const addProp = (name, optional, union) => { props[name] = { optional, union }; };

  const addMembers = (members) => {
    for (const member of members) {
      if (ts.isPropertySignature(member) && member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))) {
        addProp(member.name.text, !!member.questionToken, unionLiterals(member.type));
      }
    }
  };

  const walkType = (node) => {
    if (!node) return;
    if (ts.isParenthesizedTypeNode(node)) return walkType(node.type);
    if (ts.isIntersectionTypeNode(node)) { node.types.forEach(walkType); return; }
    if (ts.isTypeLiteralNode(node)) { addMembers(node.members); return; }

    if (ts.isTypeReferenceNode(node) || ts.isExpressionWithTypeArguments(node)) {
      const name = refName(node);
      const args = refArgs(node);
      if (name === 'VariantProps') {
        const arg = args[0];
        if (arg && ts.isTypeQueryNode(arg)) {
          const v = cva[arg.exprName.getText()];
          if (v) for (const [group, keys] of Object.entries(v)) { variants[group] = keys; props[group] = props[group] ?? { optional: true, union: keys }; }
        }
        return;
      }
      if ((name === 'Omit' || name === 'Pick') && args.length) {
        const keys = omittedKeys(node);
        const beforeProps = new Set(Object.keys(props));
        const beforeVar = new Set(Object.keys(variants));
        walkType(args[0]);
        // Scope the add/remove to keys the inner type contributed (not in
        // `before…`), so a same-named prop from a sibling intersection member is
        // never clobbered (e.g. `{ title } & Omit<X, "title">` keeps `title`).
        if (name === 'Omit') {
          for (const k of keys) {
            if (!beforeProps.has(k)) delete props[k];
            if (!beforeVar.has(k)) delete variants[k];
          }
        } else {
          for (const k of Object.keys(props)) if (!beforeProps.has(k) && !keys.includes(k)) delete props[k];
          for (const k of Object.keys(variants)) if (!beforeVar.has(k) && !keys.includes(k)) delete variants[k];
        }
        return;
      }
      if (/ComponentProps(WithoutRef|WithRef)?$/.test(name ?? '')) {
        const arg = args[0];
        if (arg && ts.isLiteralTypeNode(arg) && ts.isStringLiteral(arg.literal)) native.add(arg.literal.text);
        return;
      }
      if (name && !seenAlias.has(name)) {
        seenAlias.add(name);
        if (typeAliases[name]) walkType(typeAliases[name]);
        else if (interfaces[name]) {
          addMembers(interfaces[name].members);
          if (interfaces[name].heritageClauses) for (const h of interfaces[name].heritageClauses) h.types.forEach(walkType);
        }
      }
    }
  };

  for (const node of propTypeNodes) {
    // Reset per top-level type: `seenAlias` only guards against cycles WITHIN one
    // type's expansion, so a helper alias shared by two *Props types is expanded
    // for both rather than skipped on the second.
    seenAlias.clear();
    if (ts.isInterfaceDeclaration(node)) {
      addMembers(node.members);
      if (node.heritageClauses) for (const h of node.heritageClauses) h.types.forEach(walkType);
    } else {
      walkType(node);
    }
  }

  const sortedProps = {};
  for (const name of Object.keys(props).sort()) {
    const p = props[name];
    sortedProps[name] = { optional: p.optional, union: p.union ? [...p.union].sort() : null };
  }
  const sortedVariants = {};
  for (const g of Object.keys(variants).sort()) sortedVariants[g] = [...variants[g]].sort();

  return { variants: sortedVariants, props: sortedProps, native: [...native].sort() };
}
