import * as React from "react";
import { NavigationIcon } from "./navigation-icon";
export type NavigationAccountProps = {
  name: string;
  initials: string;
  settingsLabel: string;
  settingsHref?: string;
  onSettings?: () => void;
  onAccount?: () => void;
};
/** Keep personal email in Settings rather than exposing it in the rail. */
export function NavigationAccount({ name, initials, settingsLabel, settingsHref, onSettings, onAccount }: NavigationAccountProps) {
  const identity = <><span className="weft-navigation-space-avatar" aria-hidden="true">{initials}</span><span className="weft-navigation-space-name">{name}</span></>;
  return <div className="weft-navigation-account">
    {onAccount ? <button type="button" className="weft-navigation-account-name" onClick={onAccount}>{identity}</button> : <span className="weft-navigation-account-name">{identity}</span>}
    {settingsHref ? <a className="weft-navigation-account-settings" href={settingsHref} aria-label={settingsLabel}><NavigationIcon purpose="settings" /></a> : <button type="button" className="weft-navigation-account-settings" disabled={!onSettings} onClick={onSettings} aria-label={settingsLabel}><NavigationIcon purpose="settings" /></button>}
  </div>;
}
