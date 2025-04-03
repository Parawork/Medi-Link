"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Plus, Pill, CalendarClock } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Subscription = {
  id: string
  name: string
  medicine: string
  frequency: string
  nextDelivery: string
  status: "Active" | "Paused" | "Expired"
  pharmacy: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "sub-1",
      name: "Blood Pressure Medication",
      medicine: "Lisinopril 10mg",
      frequency: "Monthly",
      nextDelivery: "April 15, 2025",
      status: "Active",
      pharmacy: "MediCare Pharmacy",
    },
    {
      id: "sub-2",
      name: "Diabetes Management",
      medicine: "Metformin 500mg",
      frequency: "Bi-weekly",
      nextDelivery: "April 10, 2025",
      status: "Active",
      pharmacy: "Health Plus Pharmacy",
    },
    {
      id: "sub-3",
      name: "Cholesterol Control",
      medicine: "Atorvastatin 20mg",
      frequency: "Monthly",
      nextDelivery: "April 22, 2025",
      status: "Paused",
      pharmacy: "City Drugs",
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)

    toast({
      title: "Subscription created",
      description: "Your new medication subscription has been created successfully.",
    })
  }

  const handlePauseSubscription = (id: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status: "Paused" } : sub)))

    toast({
      title: "Subscription paused",
      description: "Your subscription has been paused. You can resume it anytime.",
    })
  }

  const handleResumeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, status: "Active" } : sub)))

    toast({
      title: "Subscription resumed",
      description: "Your subscription has been resumed. Next delivery is scheduled.",
    })
  }

  const getStatusColor = (status: Subscription["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Paused":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medicine Subscriptions</h1>
          <p className="text-muted-foreground mt-1">Manage your recurring medicine deliveries</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Subscription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Subscription</DialogTitle>
              <DialogDescription>Set up a recurring delivery for your medication</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubscription}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Subscription Name</Label>
                  <Input id="name" placeholder="e.g., Blood Pressure Medication" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="medicine">Medicine</Label>
                  <Input id="medicine" placeholder="e.g., Lisinopril 10mg" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pharmacy">Pharmacy</Label>
                  <Select defaultValue="pharm-1">
                    <SelectTrigger id="pharmacy">
                      <SelectValue placeholder="Select pharmacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharm-1">MediCare Pharmacy</SelectItem>
                      <SelectItem value="pharm-2">City Drugs</SelectItem>
                      <SelectItem value="pharm-3">Health Plus Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="frequency">Delivery Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input id="start-date" type="date" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Subscription</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList>
          <TabsTrigger value="active">Active ({subscriptions.filter((s) => s.status === "Active").length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({subscriptions.filter((s) => s.status === "Paused").length})</TabsTrigger>
          <TabsTrigger value="all">All Subscriptions ({subscriptions.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4 mt-6">
          {subscriptions
            .filter((sub) => sub.status === "Active")
            .map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{subscription.name}</CardTitle>
                    <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                  </div>
                  <CardDescription>{subscription.medicine}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Frequency</div>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2 text-teal-600" />
                        <span>{subscription.frequency}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Next Delivery</div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                        <span>{subscription.nextDelivery}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Pharmacy</div>
                    <div className="flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{subscription.pharmacy}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/subscriptions/${subscription.id}`}>View Details</Link>
                  </Button>
                  <Button variant="ghost" onClick={() => handlePauseSubscription(subscription.id)}>
                    Pause Subscription
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="paused" className="space-y-4 mt-6">
          {subscriptions
            .filter((sub) => sub.status === "Paused")
            .map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{subscription.name}</CardTitle>
                    <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                  </div>
                  <CardDescription>{subscription.medicine}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Frequency</div>
                      <div className="flex items-center">
                        <CalendarClock className="h-4 w-4 mr-2 text-teal-600" />
                        <span>{subscription.frequency}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Next Delivery</div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                        <span>Paused</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Pharmacy</div>
                    <div className="flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{subscription.pharmacy}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/subscriptions/${subscription.id}`}>View Details</Link>
                  </Button>
                  <Button variant="default" onClick={() => handleResumeSubscription(subscription.id)}>
                    Resume Subscription
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="all" className="space-y-4 mt-6">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{subscription.name}</CardTitle>
                  <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                </div>
                <CardDescription>{subscription.medicine}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Frequency</div>
                    <div className="flex items-center">
                      <CalendarClock className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{subscription.frequency}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Next Delivery</div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-teal-600" />
                      <span>{subscription.status === "Paused" ? "Paused" : subscription.nextDelivery}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Pharmacy</div>
                  <div className="flex items-center">
                    <Pill className="h-4 w-4 mr-2 text-teal-600" />
                    <span>{subscription.pharmacy}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/subscriptions/${subscription.id}`}>View Details</Link>
                </Button>
                {subscription.status === "Active" ? (
                  <Button variant="ghost" onClick={() => handlePauseSubscription(subscription.id)}>
                    Pause Subscription
                  </Button>
                ) : subscription.status === "Paused" ? (
                  <Button variant="default" onClick={() => handleResumeSubscription(subscription.id)}>
                    Resume Subscription
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

