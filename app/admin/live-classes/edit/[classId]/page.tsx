"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addWeeks } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface Lecturer {
  id: string;
  name: string | null;
  email: string;
  role?: string;
  isActive?: boolean;
}

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  price: number;
  maxStudents: number | null;
  duration: number;
  batchNumber: number;
  lecturerId: string;
  isActive: boolean;
  zoomLink?: string;
  zoomMeetingId?: string;
  zoomPassword?: string;
}

export default function EditLiveClassPage({ params }: { params: { classId: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("12");
  const [maxStudents, setMaxStudents] = useState("");
  const [batchNumber, setBatchNumber] = useState("1");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [lecturerId, setLecturerId] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [zoomLink, setZoomLink] = useState("");
  const [zoomMeetingId, setZoomMeetingId] = useState("");
  const [zoomPassword, setZoomPassword] = useState("");

  // Fetch live class and lecturers
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [classResponse, lecturersResponse] = await Promise.all([
          axios.get(`/api/admin/live-classes/${params.classId}`),
          axios.get("/api/admin/lecturers")
        ]);

        const liveClassData = classResponse.data;
        setLiveClass(liveClassData);
        setTitle(liveClassData.title);
        setDescription(liveClassData.description || "");
        setPrice(liveClassData.price.toString());
        setDuration(liveClassData.duration.toString());
        setMaxStudents(liveClassData.maxStudents?.toString() || "");
        setBatchNumber(liveClassData.batchNumber.toString());
        setStartDate(new Date(liveClassData.startTime));
        setLecturerId(liveClassData.lecturerId);

        // Set zoom fields
        setZoomLink(liveClassData.zoomLink || "");
        setZoomMeetingId(liveClassData.zoomMeetingId || "");
        setZoomPassword(liveClassData.zoomPassword || "");

        setLecturers(lecturersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load live class data");
        router.push("/admin/live-classes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.classId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (!lecturerId) {
      toast.error("Please select a lecturer");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate end date based on duration (in weeks)
      const endDate = addWeeks(startDate, parseInt(duration));

      // Update class data
      const classData = {
        title,
        description,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        price: parseFloat(price),
        duration: parseInt(duration),
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        batchNumber: parseInt(batchNumber),
        lecturerId,
        zoomLink,
        zoomMeetingId,
        zoomPassword
      };

      // Update live class
      await axios.patch(`/api/admin/live-classes/${params.classId}`, classData);
      
      toast.success("Live class updated successfully!");
      router.push("/admin/live-classes");
    } catch (error: any) {
      console.error("Error updating live class:", error);
      toast.error(error.response?.data?.message || "Failed to update live class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </ScrollArea>
    );
  }

  if (!liveClass) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Live Class Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The live class you&apos;re trying to edit doesn&apos;t exist.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/admin/live-classes">Back to Live Classes</Link>
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Live Class</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/live-classes">Cancel</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
            <CardDescription>
              Update the live class&apos;s details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Class Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Frontend Development" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="e.g., 150000" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="e.g., 12" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Max Students (Optional)</Label>
                  <Input 
                    id="maxStudents" 
                    type="number" 
                    placeholder="e.g., 30" 
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input 
                    id="batchNumber" 
                    type="number" 
                    placeholder="e.g., 1" 
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lecturer">Lecturer</Label>
                  <Select 
                    value={lecturerId} 
                    onValueChange={setLecturerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturers.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          {lecturer.name || lecturer.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zoomLink">Zoom Meeting Link</Label>
                  <Input
                    id="zoomLink"
                    value={zoomLink}
                    onChange={(e) => setZoomLink(e.target.value)}
                    placeholder="https://zoom.us/j/123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoomMeetingId">Zoom Meeting ID</Label>
                  <Input
                    id="zoomMeetingId"
                    value={zoomMeetingId}
                    onChange={(e) => setZoomMeetingId(e.target.value)}
                    placeholder="123456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zoomPassword">Zoom Password</Label>
                  <Input
                    id="zoomPassword"
                    value={zoomPassword}
                    onChange={(e) => setZoomPassword(e.target.value)}
                    placeholder="Enter meeting password"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  placeholder="Describe the class content and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <CardFooter className="px-0 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? "Updating..." : "Update Live Class"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 