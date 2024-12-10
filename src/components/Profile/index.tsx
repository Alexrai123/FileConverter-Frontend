import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <Select defaultValue="basic">
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Usage</span>
              <span>45/100 files</span>
            </div>
            <Progress value={45} />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Conversion Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Conversions</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>.txt files</span>
                <span>15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>.pdf files</span>
                <span>20</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>.docx files</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
