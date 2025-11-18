import { getAllAboutSectionsServerSide, getAllTeamMembersServerSide } from '@/server/functions/about-page.fun';
import DynamicAboutPage from "@/app/(main)/about/_components/DynamicAboutPage";


export default async function AboutPage() {
    const [sectionsResponse, teamMembersResponse] = await Promise.all([
        getAllAboutSectionsServerSide(),
        getAllTeamMembersServerSide()
    ]);

    const sections = sectionsResponse.isError ? [] : sectionsResponse.data?.sections || [];
    const teamMembers = teamMembersResponse.isError ? [] : teamMembersResponse.data?.teamMembers || [];

    return <DynamicAboutPage
        sections={sections} teamMembers={teamMembers} />;
}