"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Info, Coins, Target, Shield } from 'lucide-react'

interface HowToPlayModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Info className="h-6 w-6 text-cheese-yellow" />
            How to Play VibeCheese
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Learn how to predict trends and earn Vibe Points
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Free to Play */}
          <div className="flex gap-3 items-start">
            <div className="rounded-full bg-cheese-yellow/20 p-2 mt-0.5">
              <Shield className="h-5 w-5 text-cheese-yellow" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Free to Play</h3>
              <p className="text-sm text-muted-foreground">
                No crypto needed - VibeCheese is completely free to play. No real money is required or involved.
              </p>
            </div>
          </div>

          {/* Vibe Points */}
          <div className="flex gap-3 items-start">
            <div className="rounded-full bg-soneium-blue/20 p-2 mt-0.5">
              <Coins className="h-5 w-5 text-soneium-blue" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Bet with Vibe Points (VP)</h3>
              <p className="text-sm text-muted-foreground">
                Earn VP through gameplay - start with 1000 VP and earn more by winning predictions. VP can only be earned, never purchased.
              </p>
            </div>
          </div>

          {/* Predict Markets */}
          <div className="flex gap-3 items-start">
            <div className="rounded-full bg-cheese-yellow/20 p-2 mt-0.5">
              <Target className="h-5 w-5 text-cheese-yellow" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">Predict Market Outcomes</h3>
              <p className="text-sm text-muted-foreground">
                Bet &quot;Vibe In&quot; (Yes) or &quot;Vibe Out&quot; (No) on prediction markets. Winners split the losing pool proportionally.
              </p>
            </div>
          </div>

          {/* Compliance */}
          <div className="rounded-lg bg-secondary/50 p-4 border border-cheese-yellow/20">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-cheese-yellow mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Compliance</h4>
                <p className="text-xs text-muted-foreground">
                  This app complies with regulations by using free &quot;Vibe Points&quot; instead of real cryptocurrency. No real money is lost or gained.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} variant="neon" className="touch-target">
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

