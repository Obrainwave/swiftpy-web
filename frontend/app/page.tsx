import HeroSection from "./components/home/HeroSection";
import FeatureStrip from "./components/home/FeatureStrip";
import ExploreSection from "./components/home/ExploreSection";
import CommunityBanner from "./components/home/CommunityBanner";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <HeroSection />
      <FeatureStrip />
      <ExploreSection />
      <CommunityBanner />
    </div>
  );
}
