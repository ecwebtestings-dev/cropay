
import { useState } from "react";
import {
  Settings as SettingsIcon,
  UserRound,
  Bell,
  ShieldCheck,
  Smartphone,
  Save,
  LockKeyhole,
  Mail,
} from "lucide-react";

const SETTINGS_TABS = [
  { id: "general", label: "General", Icon: SettingsIcon },
  { id: "account", label: "Account", Icon: UserRound },
  { id: "notifications", label: "Notifications", Icon: Bell },
  { id: "payments", label: "Payments", Icon: Smartphone },
  { id: "security", label: "Security", Icon: ShieldCheck },
];

function SettingsSection({ title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function SettingsField({
  label,
  description,
  type = "text",
  value,
  onChange,
  placeholder = "",
  readOnly = false,
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_1.2fr] sm:items-center">
      <div>
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        )}
      </div>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 read-only:bg-slate-50"
      />
    </div>
  );
}

function SettingsSelect({ label, description, value, onChange, options }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1fr_1.2fr] sm:items-center">
      <div>
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        )}
      </div>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingsToggle({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-emerald-800" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SaveButton({ onClick, saving = false }) {
  return (
    <div className="flex justify-end border-t border-slate-100 pt-5">
      <button
        type="button"
        onClick={onClick}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-[#12372B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}

function GeneralSettings({ settings, updateSetting, saveSettings }) {
  return (
    <SettingsSection
      title="General Preferences"
      description="Personalize how you use CropPay."
    >
      <SettingsSelect
        label="Language"
        description="Choose your preferred display language."
        value={settings.language}
        onChange={(event) => updateSetting("language", event.target.value)}
        options={[
          { value: "en", label: "English" },
          { value: "lg", label: "Luganda" },
          { value: "ach", label: "Acholi" },
        ]}
      />

      <SettingsSelect
        label="Appearance"
        description="Choose how CropPay looks on your device."
        value={settings.theme}
        onChange={(event) => updateSetting("theme", event.target.value)}
        options={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "system", label: "Use device setting" },
        ]}
      />

      <SettingsSelect
        label="Currency display"
        description="Currency used to display your savings."
        value={settings.currency}
        onChange={(event) => updateSetting("currency", event.target.value)}
        options={[{ value: "UGX", label: "Ugandan Shilling (UGX)" }]}
      />

      <SaveButton onClick={saveSettings} />
    </SettingsSection>
  );
}

function AccountSettings({ settings, updateSetting, saveSettings }) {
  return (
    <SettingsSection
      title="Account Preferences"
      description="Manage your contact information."
    >
      <SettingsField
        label="Email address"
        description="Used for account communication and verification."
        type="email"
        value={settings.email}
        onChange={(event) => updateSetting("email", event.target.value)}
        placeholder="Enter your email"
      />

      <SettingsField
        label="Phone number"
        description="Your contact number. This may differ from the number used for a deposit."
        type="tel"
        value={settings.phoneNumber}
        onChange={(event) => updateSetting("phoneNumber", event.target.value)}
        placeholder="+256 7XX XXX XXX"
      />

      <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
        Updating these fields here does not change your account until the
        form is connected to your profile API.
      </p>

      <SaveButton onClick={saveSettings} />
    </SettingsSection>
  );
}

function NotificationSettings({ settings, updateSetting, saveSettings }) {
  return (
    <SettingsSection
      title="Notification Preferences"
      description="Choose which CropPay updates you want to receive."
    >
      <SettingsToggle
        label="Deposit confirmations"
        description="Know when a deposit has been confirmed."
        enabled={settings.depositNotifications}
        onChange={(value) => updateSetting("depositNotifications", value)}
      />

      <SettingsToggle
        label="Savings goal progress"
        description="Receive updates about your savings goals."
        enabled={settings.goalNotifications}
        onChange={(value) => updateSetting("goalNotifications", value)}
      />

      <SettingsToggle
        label="Payment problems"
        description="Get alerts about failed or reversed payments."
        enabled={settings.paymentNotifications}
        onChange={(value) => updateSetting("paymentNotifications", value)}
      />

      <SettingsToggle
        label="Email notifications"
        description="Receive supported notifications by email."
        enabled={settings.emailNotifications}
        onChange={(value) => updateSetting("emailNotifications", value)}
      />

      <SettingsToggle
        label="SMS notifications"
        description="Receive supported notifications by SMS."
        enabled={settings.smsNotifications}
        onChange={(value) => updateSetting("smsNotifications", value)}
      />

      <SaveButton onClick={saveSettings} />
    </SettingsSection>
  );
}

function PaymentSettings({ settings, updateSetting, saveSettings }) {
  return (
    <SettingsSection
      title="Payment Preferences"
      description="Manage your preferred deposit payment details."
    >
      <SettingsSelect
        label="Preferred payment method"
        description="Select a preferred method if supported by CropPay."
        value={settings.paymentMethod}
        onChange={(event) => updateSetting("paymentMethod", event.target.value)}
        options={[
          { value: "mobile_money", label: "Mobile Money" },
          { value: "other", label: "Other supported method" },
        ]}
      />

      <SettingsField
        label="Payment phone number"
        description="Number you prefer to use when making deposits."
        type="tel"
        value={settings.paymentPhoneNumber}
        onChange={(event) =>
          updateSetting("paymentPhoneNumber", event.target.value)
        }
        placeholder="+256 7XX XXX XXX"
      />

      <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
        Always check the payment details before confirming a deposit.
        Changing your preferred number must not change the history of
        previous transactions.
      </div>

      <SaveButton onClick={saveSettings} />
    </SettingsSection>
  );
}

function SecuritySettings({ settings, updateSetting, saveSettings }) {
  return (
    <SettingsSection
      title="Account Security"
      description="Help keep your CropPay account secure."
    >
      <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-4">
        <LockKeyhole size={20} className="mt-0.5 text-emerald-800" />
        <div>
          <p className="text-sm font-medium text-slate-800">Change password</p>
          <p className="mt-1 text-sm text-slate-500">
            Use a strong password containing at least eight characters,
            including a letter and a number.
          </p>
          <p className="mt-2 text-sm text-emerald-800">
            Use the Change Password page to update your password securely.
          </p>
        </div>
      </div>

      <SettingsToggle
        label="Security notifications"
        description="Receive supported alerts about important account activity."
        enabled={settings.securityNotifications}
        onChange={(value) => updateSetting("securityNotifications", value)}
      />

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <Mail size={19} className="text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-800">
              Email verification
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Verify your email from the account verification flow.
            </p>
          </div>
        </div>
      </div>

      <SaveButton onClick={saveSettings} />
    </SettingsSection>
  );
}

const SETTINGS_CONTENT = {
  general: GeneralSettings,
  account: AccountSettings,
  notifications: NotificationSettings,
  payments: PaymentSettings,
  security: SecuritySettings,
};

const INITIAL_SETTINGS = {
  language: "en",
  theme: "light",
  currency: "UGX",
  email: "",
  phoneNumber: "",
  depositNotifications: true,
  goalNotifications: true,
  paymentNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  paymentMethod: "mobile_money",
  paymentPhoneNumber: "",
  securityNotifications: true,
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saveMessage, setSaveMessage] = useState("");

  const ActiveSettingsContent = SETTINGS_CONTENT[activeTab];

  function updateSetting(settingName, settingValue) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [settingName]: settingValue,
    }));
    setSaveMessage("");
  }

  function saveSettings() {
    // TODO: Send settings to the Laravel API.
    // The form currently stores changes in React state only.
    setSaveMessage(
      "Your changes are on this page but have not been saved to your account yet."
    );
  }

  return (
    <div className="min-h-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your CropPay account, payments, and preferences.
        </p>
      </div>

      <nav
        aria-label="Settings sections"
        role="tablist"
        className="flex gap-2 overflow-x-auto border-b border-slate-200"
      >
        {SETTINGS_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`settings-tab-${id}`}
            aria-selected={activeTab === id}
            aria-controls={`settings-panel-${id}`}
            onClick={() => {
              setActiveTab(id);
              setSaveMessage("");
            }}
            className={`-mb-px inline-flex shrink-0 items-center gap-3 border-b-2 px-4 py-5 text-sm font-medium transition sm:px-6 ${
              activeTab === id
                ? "border-[#12372B] text-[#12372B]"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
            }`}
          >
            <Icon size={21} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      <div
        id={`settings-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`settings-tab-${activeTab}`}
      >
        <ActiveSettingsContent
          settings={settings}
          updateSetting={updateSetting}
          saveSettings={saveSettings}
        />
      </div>

      {saveMessage && (
        <p
          role="status"
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
        >
          {saveMessage}
        </p>
      )}
    </div>
  );
}
