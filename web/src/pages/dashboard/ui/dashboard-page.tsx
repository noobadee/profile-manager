import "@/app/styles/Dashboard.css";
import { useProfilesQuery } from "@/entities/profile";

export function DashboardPage() {
  const { data: profiles = [], isPending, error } = useProfilesQuery();
  
  if (isPending) {
    <div>Loading...</div>
  }

  console.log(profiles);

  return (
    <>
      <div className="wrapper">
        <div>
          <div>
            <button>New Subject</button>
          </div>
          <input type="text"/>
          {
            profiles.status === "success" && profiles.data.map((p) => (
              <p key={p.id}>{p.identity.firstName} {p.identity.middleName} {p.identity.lastName}</p>
            ))
          }
        </div>
        <div>
          <h2>Maria Cruz</h2>
        </div>
      </div>
    </>
  )
}