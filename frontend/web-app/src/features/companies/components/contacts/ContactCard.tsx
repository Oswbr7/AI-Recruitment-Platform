import { useState } from "react";
import { Check, Pencil, Star, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import type { CompanyContact } from "../../models/CompanyContact";
import { useUpdateCompanyContact } from "../../hooks/useUpdateCompanyContact";
import { useDeleteCompanyContact } from "../../hooks/useDeleteCompanyContact";
import { DeleteContactDialog } from "./DeleteContactDialog";

interface Props {

    companyId: string;

    contact: CompanyContact;

}

export function ContactCard({
    companyId,
    contact,
}: Props) {

    const [editing, setEditing] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [firstName, setFirstName] = useState(contact.firstName);
    const [lastName, setLastName] = useState(contact.lastName);
    const [email, setEmail] = useState(contact.email);
    const [phone, setPhone] = useState(contact.phone ?? "");
    const [position, setPosition] = useState(contact.position ?? "");
    const [isPrimaryContact, setIsPrimaryContact] = useState(contact.isPrimaryContact);

    const updateContact = useUpdateCompanyContact(companyId);

    const deleteContact = useDeleteCompanyContact(companyId);

    const handleCancel = () => {

        setFirstName(contact.firstName);
        setLastName(contact.lastName);
        setEmail(contact.email);
        setPhone(contact.phone ?? "");
        setPosition(contact.position ?? "");
        setIsPrimaryContact(contact.isPrimaryContact);

        setEditing(false);

    };

    const handleSave = () => {

        updateContact.mutate(
            {
                contactId: contact.id,
                request: {
                    firstName,
                    lastName,
                    email,
                    phone: phone || undefined,
                    position: position || undefined,
                    isPrimaryContact,
                },
            },
            { onSuccess: () => setEditing(false) }
        );

    };

    return (

        <Card size="sm">

            <CardContent className="space-y-2">

                {editing ? (

                    <>

                        <div className="grid gap-3 sm:grid-cols-2">

                            <Input placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                            <Input placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                            <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                            <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                            <Input placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} />

                            <label className="flex items-center gap-2 text-sm">
                                <Checkbox checked={isPrimaryContact} onCheckedChange={value => setIsPrimaryContact(!!value)} />
                                Primary contact
                            </label>

                        </div>

                        <div className="flex justify-end gap-2">

                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                <X className="mr-1 h-3.5 w-3.5" />
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                disabled={!firstName.trim() || !lastName.trim() || !email.trim() || updateContact.isPending}
                                onClick={handleSave}
                            >
                                <Check className="mr-1 h-3.5 w-3.5" />
                                Save
                            </Button>

                        </div>

                    </>

                ) : (

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="flex items-center gap-1.5 text-sm font-medium">
                                {contact.firstName} {contact.lastName}
                                {contact.isPrimaryContact && (
                                    <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                                )}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {contact.position || "—"} · {contact.email}
                                {contact.phone ? ` · ${contact.phone}` : ""}
                            </p>

                        </div>

                        <div className="flex gap-1">

                            <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)}>
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>

                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteOpen(true)}>
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>

                        </div>

                    </div>

                )}

            </CardContent>

            <DeleteContactDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isLoading={deleteContact.isPending}
                onConfirm={() =>
                    deleteContact.mutate(contact.id, { onSuccess: () => setDeleteOpen(false) })
                }
            />

        </Card>

    );

}
