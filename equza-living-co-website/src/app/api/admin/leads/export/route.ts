import { NextResponse } from 'next/server';
import { checkAdminStatus } from '@/lib/firebase/auth';
import { getLeads } from '@/lib/firebase/leads';

function toCsvValue(value: any): string {
  if (value == null) return '';
  const str = String(value).replace(/"/g, '""');
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str}"`;
  }
  return str;
}

export async function GET(request: Request) {
  try {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const dateFromStr = searchParams.get('from');
    const dateToStr = searchParams.get('to');
    const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
    const dateTo = dateToStr ? new Date(dateToStr) : undefined;

    const leads = await getLeads({
      type: type as any,
      status: status as any,
      dateFrom,
      dateTo,
    } as any);

    const header = [
      'id',
      'type',
      'name',
      'email',
      'phone',
      'message',
      'status',
      'assignedTo',
      'createdAt',
      'source',
    ];
    const rows = (leads || []).map((l: any) => [
      l.id,
      l.type || '',
      l.name || '',
      l.email || '',
      l.phone || '',
      l.message || '',
      l.status || '',
      l.assignedTo || '',
      typeof l.createdAt === 'string'
        ? l.createdAt
        : l.createdAt?.toDate?.()?.toISOString?.() || '',
      l.source || '',
    ]);

    const csv = [header, ...rows]
      .map((cols) => cols.map(toCsvValue).join(','))
      .join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="leads.csv"',
      },
    });
  } catch (error) {
    console.error('Export leads error:', error);
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
