import RecommendationList from './RecommendationList';

export default function EndOfPageRecommendations({ currentSlug }: { currentSlug: string }) {
  return (
    <div className="w-full mx-auto rounded">
      <div id="recommendation-list">
        <RecommendationList currentSlug={currentSlug} />
      </div>
    </div>
  );
}
