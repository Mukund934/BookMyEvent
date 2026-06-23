import api from "./api";

import type { DashboardResponse } from "../types/dashboard.types";

class DashboardService {
	async getOverview() {
		const response =
			await api.get<DashboardResponse>(
				"/dashboard/overview",
			);

		return response.data;
	}
}

export default new DashboardService();