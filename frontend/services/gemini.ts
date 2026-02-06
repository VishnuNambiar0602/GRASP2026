
type ApiPrediction = {
  disease: string;
  confidence: number;
};

type ApiResponse = {
  disease: string;
  confidence: number;
  top_predictions: ApiPrediction[];
  matched_symptoms: string[];
  unmatched_symptoms: string[];
  days: number;
  region: string;
};

const getRiskLevel = (confidence: number) => {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.4) return 'Moderate';
  return 'Low';
};

export const analyzeSymptoms = async (symptoms: string, days: number, region: string) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const payload = {
    symptoms: symptoms.split(',').map((item) => item.trim()).filter(Boolean),
    days,
    region
  };

  const response = await fetch(`${baseUrl}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const message = detail?.detail || 'MODEL_NOT_CONFIGURED';
    throw new Error(message);
  }

  const result: ApiResponse = await response.json();
  const riskLevel = getRiskLevel(result.confidence);

  const topList = result.top_predictions.map(
    (item) => `${item.disease} (${(item.confidence * 100).toFixed(1)}%)`
  );

  const recommendations = [
    `Top matches: ${topList.join(', ')}`,
    `Reported duration: ${result.days} day(s). Region: ${result.region}.`,
    result.unmatched_symptoms.length
      ? `Unrecognized symptoms: ${result.unmatched_symptoms.join(', ')}`
      : 'All provided symptoms were recognized.'
  ];

  return {
    summary: `Likely condition: ${result.disease} (${(result.confidence * 100).toFixed(1)}%)`,
    riskLevel,
    recommendations
  };
};
