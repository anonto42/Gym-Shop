import AboutService from "@/components/section/AboutService";
import SpecialProducts from "@/components/ui/SpecialProducts";
import AutoSlider from "@/components/section/AutoSlider";
import HeroSection from "@/components/section/HeroSection";
import PromoAndDelivery from "@/components/section/PromoAndDelivery";
import ValuablePackages from "@/components/section/ValuablePackages";

export default function Home() {
  return (
    <div className="w-full h-auto">
      <HeroSection />
      <AutoSlider />
      <ValuablePackages />
      <PromoAndDelivery />
      <SpecialProducts />
      <AboutService />
    </div>
  );
}
