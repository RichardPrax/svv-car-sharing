// src/pages/admin/users.tsx
import { AdminGuard, UsersList } from "@/components/admin";
import AppLayout from "@/components/layout/AppLayout";

export default function AdminUsersPage() {
    return (
        <AppLayout>
            <AdminGuard>
                <UsersList />
            </AdminGuard>
        </AppLayout>
    );
}

