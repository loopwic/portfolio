import { createFileRoute } from "@tanstack/react-router";

import { ExperienceSection } from "@/components/home/experience-section";
import { HomeTransitions } from "@/components/home/home-transitions";
import { PageAtmosphere } from "@/components/home/page-atmosphere";
import { ProfileSection } from "@/components/home/profile-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { SwitchStudySection } from "@/components/home/switch-study-section";

const HomePage = () => (
  <HomeTransitions>
    <div className="relative isolate text-foreground selection:bg-foreground selection:text-background">
      <PageAtmosphere />
      <div className="relative z-10">
        <ProfileSection />
        <ProjectsSection />
        <ExperienceSection />
        <SwitchStudySection />
      </div>
    </div>
  </HomeTransitions>
);

export const Route = createFileRoute("/")({
  component: HomePage,
});
