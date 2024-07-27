import { getUserRoles } from "../../util/auth";
import ContainerSection from "../common/ContainerSection";

export default function Profile() {
  return (
    <ContainerSection data-testid="profile-section">
      <h1>Profil</h1>
      <p>Użytkownik jest zalogowany</p>
      <p>Role użytkownika: {getUserRoles()} </p>
    </ContainerSection>
  );
}
