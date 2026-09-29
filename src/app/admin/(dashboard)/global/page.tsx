import { redirect } from 'next/navigation';

// O Global (header e footer) passou pra Seções.
export default function AdminGlobalRedirect() {
  redirect('/admin/pages');
}
