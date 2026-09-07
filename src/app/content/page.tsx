import { redirect } from 'next/navigation';

export default async function ContentRedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const params = await searchParams;
  redirect(params?.section ? `/?section=${params.section}` : '/');
}
