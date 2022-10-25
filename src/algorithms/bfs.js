export function bfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const queue = [];
  queue.push(startNode);
  startNode.isVisited = true;
  while (queue.length) {
    const currnode = queue.shift();
    if (currnode.isWall || currnode.distance === Infinity) continue;
    visitedNodesInOrder.push(currnode);
    if (currnode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(currnode, grid, queue);
  }
  return visitedNodesInOrder;
}
function updateUnvisitedNeighbors(node, grid, queue) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
    neighbor.isVisited = true;
    queue.push(neighbor);
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}
