export interface DashboardOverview {
	totalRevenue: number;
	totalBookings: number;
	cancelledBookings: number;
	cancellationRate: number;

	topEvents: {
		_id: string;
		title: string;
		revenue: number;
		bookings: number;
	}[];

	monthlyTrends: {
		_id: {
			year: number;
			month: number;
		};
		totalBookings: number;
		revenue: number;
	}[];
}

export interface DashboardResponse {
	success: boolean;
	source: string;
	data: DashboardOverview;
}