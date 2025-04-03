"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CreditCard, Truck, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const [isSubscription, setIsSubscription] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Mock pharmacy data
  const pharmacy = {
    id: params.id,
    name: "MediCare Pharmacy",
    address: "123 Health St, San Francisco, CA"
  }

  // Mock order data
  const order = {
    items: [
      { name: "Lisinopril 10mg", quantity: 30, price: 15.99 },
      { name: "Metformin 500mg", quantity: 60, price: 24.50 },
      { name: "Vitamin D3 1000IU", quantity: 90, price: 12.75 }
    ],
    subtotal: 53.24,
    tax: 4.26,
    deliveryFee: 5.99,
    total: 63.49
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Order placed successfully!",
        description: isSubscription 
          ? "Your subscription has been set up and your first order is on its way." 
          : "Your order has been confirmed and is being processed.",
      })
      
      // Redirect to confirmation page
      router.push("/orders/confirmation")
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/pharmacies/results" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                Pharmacy Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="font-medium">{pharmacy.name}</h3>
                <p className="text-muted-foreground">{pharmacy.address}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-teal-600" />
                Delivery Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={deliveryMethod} 
                onValueChange={setDeliveryMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                    <div className="font-medium">Home Delivery</div>
                    <div className="text-sm text-muted-foreground">Delivered to your doorstep</div>
                  </Label>
                  <div className="font-medium">$5.99</div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                    <div className="font-medium">Pickup from Pharmacy</div>
                    <div className="text-sm text-muted-foreground">Ready in 30 minutes</div>
                  </Label>
                  <div className="font-medium">Free</div>
                </div>
              </RadioGroup>
              
              {deliveryMethod === "delivery" && (
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Delivery Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" defaultValue="123 Main St" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="San Francisco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" defaultValue="CA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" defaultValue="94105" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="(555) 123-4567" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-teal-600" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-on-card">Name on Card</Label>
                    <Input id="name-on-card" placeholder="John Doe" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                Subscription Options
              </CardTitle>
              <CardDescription>
                Save time by setting up automatic refills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="subscription" 
                  checked={isSubscription}
                  onCheckedChange={(checked) => setIsSubscription(checked as boolean)}
                />
                <Label htmlFor="subscription" className="cursor-pointer">
                  <div className="font-medium">Set up recurring delivery</div>
                  <div className="text-sm text-muted-foreground">
                    We'll automatically refill and deliver your prescription
                  </div>
                </Label>
              </div>
              
              {isSubscription && (
                <div className="mt-4 pl-6 border-l-2 border-teal-200">
                  <RadioGroup defaultValue="monthly" className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly" className="cursor-pointer">Weekly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value\

