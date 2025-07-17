import { ActivityModel } from "../database/activity";
import { formatDate } from "../helpers/formatters";

interface DealCardDetails {
    id: number;
    name: string;
    image: string;
    reward: number;
    playerCount: number;
    maxPlayers: number;
    startDate: string;
    endDate: string;
    status: "upcoming" | "active" | "completed";
}

class ActivityController {
    async getFeaturedActivities(activityModel: ActivityModel): Promise<DealCardDetails[]> {
        try {
            const rawFeatured = await activityModel.getFeaturedActivities();

            const featured: DealCardDetails[] = [];
            const today = new Date();

            for (const r of rawFeatured) {
                let status: "upcoming" | "active" | "completed";
                if (r.startDate > today) {
                    status = "upcoming";
                } else if (r.endDate < today) {
                    status = 'completed';
                } else {
                    status = 'active'
                }

                featured.push({
                    ...r,
                    status,
                    startDate: formatDate(r.startDate),
                    endDate: formatDate(r.endDate)
                })
            }

            return featured;
        } catch(err) {
            console.error("Error getting featured activities", err);
            throw new Error("Error getting featured activities");
        }
    }
}

const activityController = new ActivityController();
export default activityController;