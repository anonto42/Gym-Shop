

export interface ISignUpInput extends FormData {
    email: string;
    password: string;
    name: string;
}

export interface ISignInInput extends FormData {
    email: string;
    password: string;
}

export interface IForgotPasswordInput extends FormData {
    email: string;
}

export interface IVerifyOtpInput extends FormData {
    email: string;
    otp: string;
}

export interface ISetPasswordInput extends FormData {
    email: string;
    token: string;
    password: string;
}

export interface IChangePasswordInput extends FormData {
    userToken: string;
    password: string;
}

export interface IUpdateHeroSectionInput extends FormData {
    title: string;
    description: string; 
}

export interface IUpdatePrivacyPolicySectionInput extends FormData {
    content: string;
}