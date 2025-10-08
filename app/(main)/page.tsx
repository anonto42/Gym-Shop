import AutoSlider from "@/components/section/AutoSlider";
import HeroSection from "@/components/section/HeroSection";
import ValuablePackages from "@/components/section/ValuablePackages";


export default function Home() {
  return (
    <div className="w-full h-auto">
      <HeroSection />
      <AutoSlider />
      <ValuablePackages />
    </div>
  );
}
