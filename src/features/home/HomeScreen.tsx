import { ConverterWidget } from '../converter/ConverterWidget';
import { HistoricalChart } from '../charts/HistoricalChart';
import { LiveRates } from '../rates/LiveRates';
import { motion } from 'motion/react';

interface HomeScreenProps {
  selectedFrom: string;
  selectedTo: string;
  setSelectedFrom: (from: string) => void;
  setSelectedTo: (to: string) => void;
}

export function HomeScreen({ selectedFrom, selectedTo, setSelectedFrom, setSelectedTo }: HomeScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-12"
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl md:text-5xl font-black leading-tight text-ink-deep">
          Live Currency Converter
        </h1>
        <p className="text-secondary text-lg font-medium max-w-2xl leading-relaxed">
          Check real-time foreign exchange rates instantly. Trusted by millions of users worldwide for accurate and fast conversions.
        </p>
      </div>

      <div className="w-full">
        <ConverterWidget 
          onFromChange={setSelectedFrom} 
          onToChange={setSelectedTo} 
        />
      </div>

      <div className="w-full">
        <HistoricalChart from={selectedFrom} to={selectedTo} />
      </div>

      <div className="w-full">
        <LiveRates base={selectedFrom} />
      </div>
    </motion.div>
  );
}
