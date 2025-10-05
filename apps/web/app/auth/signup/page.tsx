import createMetaData from 'helper/createMetaData';
import { Metadata } from 'next';
import React from 'react'
import AuthContainer from '../_components/_auth/AuthContainer';

export const metadata: Metadata = createMetaData({
  title: "Sign Up",
  description: "Sign Up",
  keywords: ["Sign Up", "Sign Up Page"],
});

export default function SignUpPage() {
  return <AuthContainer page='signup' />
}