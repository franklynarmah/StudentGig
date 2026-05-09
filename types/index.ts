export interface Profile {
  id: string;
  full_name: string;
  programme: string;
  level: string;
  hall: string;
  student_id: string | null;
  is_worker: boolean;
  is_poster: boolean;
  available_now: boolean;
  member_since: string;
  email?: string;
}

export interface Gig {
  id: string;
  poster_id: string;
  title: string;
  description: string;
  gig_type: string;
  pay_type: string;
  pay_amount: number | null;
  location: string;
  contact: string;
  is_open: boolean;
  created_at: string;
}
