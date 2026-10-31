import { useState } from "react";
import { UserRound, LockKeyhole, ContactRound,UserRoundX} from "lucide-react";
import AccountSettings from "../../../components/Usersettings/AccountSettings";
import SecuritySettings from "../../../components/Usersettings/SecuritySettings";



// SETTINGS TABS.
const TABS = [
  {
    id: "account",
    label: "Account Information",
    Icon: UserRound,
  },
  {
    id: "password",
    label: "Change Password",
    Icon: LockKeyhole,
  },
  {
    id: "profile",
    label: "Personal Profile",
    Icon: ContactRound,
  },
  {
    id: "delete",
    label: "Delete Account",
    Icon: UserRoundX,
  },
];




export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  
  return (
    <section className="space-y-6 text-muted bg-card">
      <div className="px-4 rounded-sm shadom-xs">
        <h1 className="text-lg font-semibold text-heading">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Manage your account and security preferences.
        </p>
      </div>

      {/*  NAVIGATION TABS */}
      <div className="overflow-x-auto border-b border-border">
        <div className="flex min-w-max gap-6">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id);
              }}
              className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm transition ${
                activeTab === id
                  ? "border-foreground font-medium text-heading"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTAINS THE SETTINGS FORMS. */}
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
        <div className={activeTab === "account" ? "block" : "hidden"}>
          <AccountSettings activeTab="account"  />
        </div>

        <div className={activeTab === "password" ? "block" : "hidden"}>
          <SecuritySettings activeTab="password"  />
        </div>

        <div className={activeTab === "profile" ? "block" : "hidden"}>
          <AccountSettings activeTab="profile"  />
        </div>

        <div className={activeTab === "delete" ? "block" : "hidden"}>
          <SecuritySettings activeTab="delete"  />
        </div>
      </div>
    </section>
  );
}
