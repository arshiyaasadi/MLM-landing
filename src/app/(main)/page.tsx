import { MLMHero } from '@/components/MLMHero'
import { MLMSystem } from '@/components/MLMSystem'
import { BentoGrid } from '@/components/BentoGrid'
import { LiveChart } from '@/components/LiveChart'
import { StakingPools } from '@/components/StakingPools'
import { MLMEngine } from '@/components/MLMEngine'
import { Faqs } from '@/components/Faqs'
import { NibMarketFunds } from '@/components/NibMarketFunds'

export default function Home() {
  return (
    <>
      <MLMHero />
      <MLMSystem />
      <BentoGrid />
      <LiveChart />
      <MLMEngine />
      <StakingPools />
      <NibMarketFunds />
      <Faqs />
    </>
  )
}
