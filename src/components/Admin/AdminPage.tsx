import React, { useState, useEffect } from "react";
import {
  getUsers,
  updateUserByEmail,
  deleteUserByEmail,
} from "../../api/apiClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2, Users } from "lucide-react";
import apiClient from "@/api/apiClient";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedSubscription, setUpdatedSubscription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      console.log("Users data:", response.data); // Adaugă acest log
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await apiClient.get("/subscriptionTypes/all");
      setSubscriptions(response.data); // Populează abonamentele
    } catch (error) {
      console.error("Failed to fetch subscription types:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch subscription types. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchUsers(); // Preia utilizatorii
    fetchSubscriptions(); // Preia tipurile de abonamente
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setUpdatedEmail(user.email);
    setUpdatedSubscription(user.subscriptionType.typeName);
  };

  const handleUpdate = async () => {
    try {
      await updateUserByEmail(editingUser.email, {
        email: updatedEmail,
        subscriptionType: updatedSubscription,
      });

      toast({
        title: "Success",
        description: "User updated successfully.",
      });

      setEditingUser(null); // Închide dialogul
      fetchUsers(); // Reîmprospătează lista de utilizatori
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!userToDelete || !userToDelete.email) return;

    try {
      await deleteUserByEmail(userToDelete.email);

      // Afișează notificare de succes
      toast({
        title: "Success",
        description: `User ${userToDelete.email} deleted successfully.`,
      });

      // Elimină utilizatorul din lista locală
      setUsers(users.filter((user) => user.email !== userToDelete.email));

      // Închide dialogul
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          {users.length} users total
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-left">
                  {user.id}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.subscriptionType.typeName}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setUserToDelete(user);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={editingUser !== null}
        onOpenChange={() => setEditingUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subscription</label>
              <Select
                value={updatedSubscription}
                onValueChange={setUpdatedSubscription}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((sub) => (
                    <SelectItem
                      key={sub.subscription_type_id}
                      value={sub.typeName}
                    >
                      {sub.typeName} - ${sub.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log("Save Changes clicked");
                handleUpdate();
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPage;
