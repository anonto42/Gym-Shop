"use client"
import React, { Component } from 'react'
import SignInView from './SignInView';
import SignUpView from './SignUpView';

type Tpage = 'signin' | 'signup' | 'forgot-password' | 'set-password' | 'enter-otp';

interface IAuthContainerProps {
  page: Tpage;
}

interface IAuthContainerState {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  success: boolean;
}

export default class AuthContainer extends Component<IAuthContainerProps, IAuthContainerState> {

  state: IAuthContainerState = {
    email: "",
    password: "",
    error: "",
    loading: false,
    success: false,
  }

  render() {

    const { page } = this.props;

    return (
      page === "signin" ? 
      <SignInView 
        isOpen={true} 
        isClose={true} 
      /> : 
      <SignUpView
        isClose={false}
        isOpen={true}
      />
    )
  }
}
