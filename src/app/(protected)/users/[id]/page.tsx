import { redirect } from "next/navigation";
import UserDetailsPageView from "./UsersDetailsView";
import { mockUsers } from "@/src/mocks/users";

interface Props {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: Props) {
  const { id } = await params;

  // TODO: Fetch admin from database
  const user = mockUsers.find((u) => u.id === id);

  if (!user) {
    redirect("/users");
  }

  return <UserDetailsPageView user={user} />;
}
