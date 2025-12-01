const Backend = process.env.REACT_APP_BACKEND_URL;

const SummaryApi = {
    Test: {
        url: `${Backend}/api/test`,
        method: "get"
    },
    Signup: {
        url: `${Backend}/api/signup`,
        method: "post"
    },
    Login: {
        url: `${Backend}/api/login`,
        method: "post"
    },
    ForgotPassword: {
        url: `${Backend}/api/forgot-password`,
        method: "post"
    },
    ResetPassword: {
        url: `${Backend}/api/reset-password`,
        method: "post"
    },
    VerifyEmail: {
        url: `${Backend}/api/verify-email`,
        method: "post"
    },
    ValidateOtp: {
        url: `${Backend}/api/validate-otp`,
        method: "post"
    },
    CreateAuth: {
        url: `${Backend}/api/create-auth`,
        method: "post"
    },
    GetAuthSetups: {
        url: `${Backend}/api/auth-setups`,
        method: "get"
    }
};

export default SummaryApi;