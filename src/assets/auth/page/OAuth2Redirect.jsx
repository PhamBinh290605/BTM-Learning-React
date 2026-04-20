import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getRoleFromToken } from "../../../utils/jwt";
import { getDefaultRouteByRole, saveSession } from "../../../utils/session";

const OAUTH_REDIRECT_KEY = "oauth2_post_login_redirect";

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get("token") || searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token") || "";
    const queryRedirect = searchParams.get("redirect") || "";
    const storedRedirect = sessionStorage.getItem(OAUTH_REDIRECT_KEY) || "";

    sessionStorage.removeItem(OAUTH_REDIRECT_KEY);

    if (!accessToken) {
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
      navigate("/auth/login", { replace: true });
      return;
    }

    saveSession({ accessToken, refreshToken });

    const role = getRoleFromToken(accessToken);
    const redirectTarget =
      (queryRedirect.startsWith("/") && queryRedirect) ||
      (storedRedirect.startsWith("/") && storedRedirect) ||
      getDefaultRouteByRole(role);

    toast.success("Đăng nhập Google thành công.");
    navigate(redirectTarget, { replace: true });
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
        <h1 className="text-lg font-bold text-white">Đang hoàn tất đăng nhập Google</h1>
        <p className="mt-2 text-sm text-slate-300">Vui lòng chờ trong giây lát...</p>
      </div>
    </div>
  );
};

export default OAuth2Redirect;
