import activityModel, { ActivityModel, ActivityStatus, RawDealCardDetails } from "../database/activity";
import { Errors, MyError } from "../helpers/errors";
import { formatDate } from "../helpers/formatters";
import { CommissionPaid, FilteredActivity, GetOperatorWalletSchema, RewardPaid, StoreOperatorWallet } from "../helpers/types";

interface DealCardDetails {
    id: number;
    name: string;
    image: string;
    reward: number;
    playerCount: number;
    maxPlayers: number;
    startDate: string;
    endDate: string;
    status: ActivityStatus;
}

export const DEFAULT_FILTER_VALUE = 'all';
export const DEFAULT_SEARCH_VALUE = '';

class ActivityController {
    private _processRawDealCardDetails(raw: RawDealCardDetails[]): DealCardDetails[] {
        const featured: DealCardDetails[] = [];
        const today = new Date();

        for (const r of raw) {
            let status: ActivityStatus;
            if (r.startDate > today) {
                status = ActivityStatus.UPCOMING;
            } else if (r.endDate < today) {
                status = ActivityStatus.COMPLETED;
            } else {
                status = ActivityStatus.ACTIVE;
            }

            featured.push({
                ...r,
                status,
                startDate: formatDate(r.startDate),
                endDate: formatDate(r.endDate)
            })
        }

        return featured;
    }

    async getFeaturedActivities(activityModel: ActivityModel): Promise<DealCardDetails[]> {
        try {
            const rawFeatured = await activityModel.getFeaturedActivities();

            const featured = this._processRawDealCardDetails(rawFeatured);
            return featured;
        } catch (err) {
            console.error("Error getting featured activities", err);
            throw new Error("Error getting featured activities");
        }
    }

    async filterAcitivities(args: FilteredActivity, activityModel: ActivityModel): Promise<DealCardDetails[]> {
        try {
            console.log("Filtering activities with args", args);
            const sanitizedArgs: FilteredActivity = {page: args.page};
            sanitizedArgs.category = args.category !== DEFAULT_FILTER_VALUE && args.category !== undefined ? args.category : undefined;
            sanitizedArgs.game = args.game !== DEFAULT_FILTER_VALUE && args.game !== undefined ? args.game : undefined;
            sanitizedArgs.rewards = args.rewards !== DEFAULT_FILTER_VALUE && args.rewards !== undefined ? args.rewards : undefined;
            sanitizedArgs.status = args.status !== DEFAULT_FILTER_VALUE && args.status !== undefined ? args.status : undefined;
            sanitizedArgs.search = args.search !== DEFAULT_SEARCH_VALUE ? args.search : undefined;
            sanitizedArgs.adminId = args.adminId;

            // Get milestone activities
            const filteredMilestones = await activityModel.filterMilestones(sanitizedArgs);

            const filtered = this._processRawDealCardDetails(filteredMilestones);
            return filtered;
        } catch (err) {
            console.error("Error filtering activities", err);
            throw new Error("Could not filter activities");
        }
    }

    async storeOperatorWallet(args: StoreOperatorWallet, activityModel: ActivityModel) {
        try {
            const isAlreadyStored = await activityModel.isOperatorAddressAlreadyStored(args.useraddress, args.operatoraddress);
            if (isAlreadyStored) {
                return;
            }

            const isUsedByOtherPlayer = await activityModel.isOperatorAddressUsedByOtherPlayer(args.operatoraddress, args.useraddress);
            if (isUsedByOtherPlayer) {
                throw new MyError(Errors.OPERATOR_ADDRESS_USED_BY_OTHER_PLAYER);
            }

            const gameID = await activityModel.getGameID(args.activity_id);
            if (!gameID) {
                throw new Error("Activity not attached to game");
            }

            await activityModel.storeOperatorWallet({gameid: gameID, useraddress: args.useraddress, operatoraddress: args.operatoraddress});
        } catch(err) {
            console.error("Error storing operator wallet", err);
            throw new Error("Error storing operator wallet");
        }
    }

    async getOperatorWallet(args: GetOperatorWalletSchema): Promise<string | null> {
        try {
            const operatorWallet = await activityModel.getOperatorWallet(args.userwallet, args.activityid);
            return operatorWallet;
        } catch(err) {
            console.log("Error getting operator wallet for user", err);
            throw new Error("Error getting operator wallet");
        }
    }
    
    async getUserBattles(userAddress: string): Promise<DealCardDetails[]> {
        try {
            const rawBattles = await activityModel.getUserBattles(userAddress);
            const battles = this._processRawDealCardDetails(rawBattles);
            return battles;
        } catch (err) {
            console.error("Error getting user's battles", err);
            throw new Error("Error getting user's battles");
        }
    }

    async markCommissionPaid(args: CommissionPaid, activityModel: ActivityModel) {
        try {
            const hasTxnBeenUsed = await activityModel.hasTransactionBeenUsed(args.txHash);
            if (hasTxnBeenUsed === true) {
                throw new MyError(Errors.TRANSACTION_HAS_BEEN_USED);
            }

            await activityModel.storeCommissionTxn(args.activityID, args.txHash);
        } catch(err) {
            if (err instanceof MyError) {
                throw err;
            }

            console.error("Error marking commission as paid", err);
            throw new Error("Error marking commission as paid");
        }
    }

    async markRewardLocked(args: RewardPaid, activityModel: ActivityModel) {
        try {
            const hasTxnBeenUsed = await activityModel.hasTransactionBeenUsed(args.txHash);
            if (hasTxnBeenUsed === true) {
                throw new MyError(Errors.TRANSACTION_HAS_BEEN_USED);
            }

            await activityModel.storeRewardTxn(args.activityID, args.txHash);
        } catch(err) {
            if (err instanceof MyError) {
                throw err;
            }

            console.error("Error marking reward as locked", err);
            throw new Error("Error marking rewards as paid");
        }
    }
}

const activityController = new ActivityController();
export default activityController;