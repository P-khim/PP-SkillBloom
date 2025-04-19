import AuthWrapper from "../components/AuthWrapper";
import Companies from "../components/Landing/Companies";
import Everything from "../components/Landing/Everything";
import HeroBanner from "../components/Landing/HeroBanner";
import JoinSkillBloom from "../components/Landing/JoinSkillBloom";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import { useStateProvider } from "../context/StateContext";
import React from "react";
import SkillBloomBusiness from "../components/Landing/SkillBloomBusiness";

function Index() {
  const [{ showLoginModal, showSignupModal }] = useStateProvider();

  return (
    <div>
      <HeroBanner />
      <Companies />
      <Services />
      <Everything />
      <PopularServices />
      <SkillBloomBusiness />
      <JoinSkillBloom />
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
    </div>
  );
}

export default Index;
