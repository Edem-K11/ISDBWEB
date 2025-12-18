import HeroSection from "@/components/layout/hero";
import { lexendDeca, plusJakartaSans } from "../../ui/fonts";


// Hero Component
export default function Hero(){
  return(
    <>
      <HeroSection
        title="Master Recherche en Philosophie"
        description="Une formation d'excellence pour approfondir les grands enjeux philosophiques contemporains"
        image_url="/isdb_img8.jpeg"
      />
    </>
  );
}
