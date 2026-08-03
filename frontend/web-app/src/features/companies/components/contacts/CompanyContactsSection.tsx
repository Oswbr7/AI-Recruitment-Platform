import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/shared/components/empty-state/EmptyState";

import { useCompanyContacts } from "../../hooks/useCompanyContacts";
import { useAddCompanyContact } from "../../hooks/useAddCompanyContact";
import { ContactCard } from "./ContactCard";

interface Props {

    companyId: string;

}

export function CompanyContactsSection({
    companyId,
}: Props) {

    const [formOpen, setFormOpen] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const [isPrimaryContact, setIsPrimaryContact] = useState(false);

    const { data: contacts, isLoading } = useCompanyContacts(companyId);

    const addContact = useAddCompanyContact(companyId);

    const resetForm = () => {

        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPosition("");
        setIsPrimaryContact(false);
        setFormOpen(false);

    };

    const handleAdd = () => {

        if (!firstName.trim() || !lastName.trim() || !email.trim())
            return;

        addContact.mutate(
            {
                firstName,
                lastName,
                email,
                phone: phone || undefined,
                position: position || undefined,
                isPrimaryContact,
            },
            { onSuccess: resetForm }
        );

    };

    return (

        <Card>

            <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>Contacts</CardTitle>

                {!formOpen && (

                    <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
                        <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                        Add Contact
                    </Button>

                )}

            </CardHeader>

            <CardContent className="space-y-4">

                {formOpen && (

                    <div className="space-y-3 rounded-lg border p-4">

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

                            <Button variant="outline" size="sm" onClick={resetForm}>
                                Cancel
                            </Button>

                            <Button
                                size="sm"
                                disabled={!firstName.trim() || !lastName.trim() || !email.trim() || addContact.isPending}
                                onClick={handleAdd}
                            >
                                Add
                            </Button>

                        </div>

                    </div>

                )}

                {isLoading ? null : !contacts?.length ? (

                    <EmptyState
                        title="No contacts yet"
                        description="Add the first contact for this company."
                    />

                ) : (

                    <div className="space-y-3">

                        {contacts.map(contact => (
                            <ContactCard key={contact.id} companyId={companyId} contact={contact} />
                        ))}

                    </div>

                )}

            </CardContent>

        </Card>

    );

}
