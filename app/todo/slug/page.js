export default function TodoDetail({ params }) {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Todo Detail Page</h2>
      <p><strong>Slug:</strong> {params.slug}</p>
    </div>
  );
}
