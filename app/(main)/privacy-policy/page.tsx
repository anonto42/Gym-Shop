import React from "react";
import {getPrivacyAndPolicyServerSide} from "@/server/functions/admin.fun";

async function PrivacyAndReturnPage() {
    const conent = await getPrivacyAndPolicyServerSide().then( e=> e.data) as string;

  return (
    <section className="w-full min-h-screen bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
          <div
            className={"prose prose-lg max-w-none"}
            dangerouslySetInnerHTML={{__html: conent}}
          />
      </div>
    </section>
  );
}

export default PrivacyAndReturnPage;
