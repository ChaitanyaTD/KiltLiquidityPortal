import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useBaseNetwork } from '@/hooks/use-base-network';
import { useAccount } from 'wagmi';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export function BaseNetworkIndicator() {
  const { isConnected } = useAccount();
  const { isOnBase, shouldSwitchToBase, switchToBase } = useBaseNetwork();

  if (!isConnected) {
    return null;
  }

  if (shouldSwitchToBase) {
    return (
      <Button
        onClick={switchToBase}
        variant="outline"
        size="sm"
        className="bg-[#f26522]/10 text-[#f26522] border-[#f26522]/30 hover:bg-[#f26522]/20 flex items-center gap-2"
      >
        <AlertTriangle className="h-3 w-3" />
        Switch to Base
      </Button>
    );
  }

  if (isOnBase) {
    return (
      <Badge variant="outline" className="bg-[#00a3ad]/10 text-[#00a3ad] border-[#00a3ad]/30">
        <CheckCircle className="h-3 w-3 mr-1" />
        Base Network
      </Badge>
    );
  }

  return null;
}