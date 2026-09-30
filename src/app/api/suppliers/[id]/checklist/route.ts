import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { checklist, notes } = body;

    const completedCount = Object.values(checklist).filter(Boolean).length;
    // If all 9 checks are completed, mark VERIFIED; otherwise if at least 1, mark CONTACTED or SAMPLE_ORDERED
    let verificationStatus = "UNVERIFIED";
    if (completedCount >= 8) {
      verificationStatus = "VERIFIED";
    } else if (checklist.sampleOrdered) {
      verificationStatus = "SAMPLE_ORDERED";
    } else if (checklist.supplierContacted) {
      verificationStatus = "CONTACTED";
    }

    const updated = await db.supplier.update({
      where: { id },
      data: {
        checklistJson: JSON.stringify(checklist),
        verificationStatus,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    return NextResponse.json({ success: true, supplier: updated });
  } catch (error: any) {
    console.error("Error updating supplier checklist:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
