
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/common/InputFields";
import { updateUsernameOrEmail } from "../../api/settings";
import { UserProfile, updateUserProfile } from "../../api/profile";

// INITIAL PROFILE VALUES.
const INITIAL_PROFILE = {
  phone: "",
  district: "",
  village: "",
  bio: "",
};

export default function AccountSettings({ activeTab }) {
  const { user, updateUser } = useAuth();

  const [account, setAccount] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  const [profile, setProfile] = useState({ ...INITIAL_PROFILE });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // SYNCHRONIZES ACCOUNT VALUES WITH THE AUTHENTICATED USER.
  useEffect(() => {
    setAccount({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
  }, [user?.name, user?.email]);

  // LOADS PROFILE INFORMATION.
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setProfileLoading(true);

        const response = await UserProfile();

        if (cancelled) return;

        const profileData =
          response.data?.profile ??
          response.data?.user_profile ??
          response.data?.data?.profile ??
          response.data?.data?.user_profile ??
          response.data?.data ??
          response.data;

        setProfile({
          phone: profileData?.phone ?? "",
          district: profileData?.district ?? "",
          village: profileData?.village ?? "",
          bio: profileData?.bio ?? "",
        });
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err.response?.data?.message ??
              "Failed to load profile information."
          );
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  // CONVERTS SERVER VALIDATION ERRORS INTO FIELD ERRORS.
  const setServerErrors = (validationErrors) => {
    if (!validationErrors) return;

    const formattedErrors = {};

    Object.entries(validationErrors).forEach(([key, value]) => {
      formattedErrors[key] = Array.isArray(value) ? value[0] : value;
    });

    setErrors(formattedErrors);
  };

  // UPDATES ACCOUNT INPUT VALUES.
  const handleAccountChange = (event) => {
    const { name, value } = event.target;

    setAccount((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // UPDATES PROFILE INPUT VALUES.
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  // SUBMITS ACCOUNT INFORMATION UPDATES.
  const handleAccountSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const name = account.name.trim();
    const email = account.email.trim().toLowerCase();

    const currentName = user?.name ?? "";
    const currentEmail = (user?.email ?? "").toLowerCase();

    const payload = {};
    const validationErrors = {};

    // VALIDATES THE NAME.
    if (name !== currentName) {
      if (!name) {
        validationErrors.name = "Full name is required.";
      } else {
        payload.name = name;
      }
    }

    // VALIDATES THE EMAIL.
    if (email !== currentEmail) {
      if (!email) {
        validationErrors.email = "Email address is required.";
      } else {
        payload.email = email;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    if (Object.keys(payload).length === 0) {
      toast.error("No changes have been made.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateUsernameOrEmail(payload);

      const updatedName = response.data?.new_name ?? name;
      const updatedEmail = response.data?.new_email ?? email;

      // PRESERVES EXISTING AUTHENTICATED USER DATA.
      updateUser({
        ...user,
        name: updatedName,
        email: updatedEmail,
      });

      setAccount({
        name: updatedName,
        email: updatedEmail,
      });

      toast.success(
        response.data?.message ??
          "Account information updated successfully."
      );
    } catch (err) {
      console.error("FAILED TO UPDATE ACCOUNT:", err);

      setServerErrors(err.response?.data?.errors);

      toast.error(
        err.response?.data?.message ??
          "Failed to update account information."
      );
    } finally {
      setLoading(false);
    }
  };

  // SUBMITS PROFILE INFORMATION UPDATES.
  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    try {
      setProfileSaving(true);

      const response = await updateUserProfile(profile);

      toast.success(
        response.data?.message ?? "Profile updated successfully."
      );
    } catch (err) {
      console.error("FAILED TO UPDATE PROFILE:", err);

      setServerErrors(err.response?.data?.errors);

      toast.error(
        err.response?.data?.message ?? "Failed to update profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <>
      {/* ACCOUNT INFORMATION FORM. */}
      {activeTab === "account" && (
        <form onSubmit={handleAccountSubmit} className="max-w-xl space-y-4">
          <div className="mb-5">
            <h2 className="text-base font-semibold">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-muted">
              Edit your name or email address below.
            </p>
          </div>

          <InputField
            label="Full name"
            name="name"
            placeholder="Enter your full name"
            value={account.name}
            onChange={handleAccountChange}
            error={errors.name}
            autoComplete="name"
            required
          />

          <InputField
            label="Email address"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={account.email}
            onChange={handleAccountChange}
            error={errors.email}
            autoComplete="email"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      )}

      {/* PROFILE INFORMATION FORM. */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="max-w-xl space-y-4">
          <div className="mb-5">
            <h2 className="text-base font-semibold">
              Profile Information
            </h2>

            <p className="mt-1 text-sm text-muted">
              Manage your contact details and personal information.
            </p>
          </div>

          {profileLoading ? (
            <div className="flex items-center gap-2 py-4 text-sm text-muted">
              <Loader2 size={16} className="animate-spin" />
              Loading profile information...
            </div>
          ) : (
            <>
              <InputField
                label="Phone number"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={profile.phone}
                onChange={handleProfileChange}
                error={errors.phone}
                autoComplete="tel"
              />

              <InputField
                label="District"
                name="district"
                placeholder="Enter your district"
                value={profile.district}
                onChange={handleProfileChange}
                error={errors.district}
              />

              <InputField
                label="Village"
                name="village"
                placeholder="Enter your village"
                value={profile.village}
                onChange={handleProfileChange}
                error={errors.village}
              />

              <div className="space-y-1.5">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-foreground"
                >
                  Bio
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  placeholder="Tell us a little about yourself"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground"
                />

                {errors.bio && (
                  <p className="text-sm text-danger">{errors.bio}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {profileSaving && (
                  <Loader2 size={15} className="animate-spin" />
                )}

                {profileSaving ? "Saving..." : "Save profile"}
              </button>
            </>
          )}
        </form>
      )}
    </>
  );
}

