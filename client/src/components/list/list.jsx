import './list.scss';
import Card from '../card/Card';

function List({ posts }) { 
  if (!Array.isArray(posts)) {
    console.error("The 'posts' prop must be an array. Received:", posts);
    return <div>No posts available!</div>; 
  }

  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default List;
