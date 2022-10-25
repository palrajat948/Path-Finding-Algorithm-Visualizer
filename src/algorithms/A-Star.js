export function a_star(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  console.log(startNode.row + ' ' + startNode.col + '\n');
  startNode.distance = 0;
  startNode.g = 0;
  startNode.f = 0;
  startNode.h = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByF(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    console.log(
      closestNode.row + ' ' + closestNode.col + ' ' + closestNode.f + '\n',
    );
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }
}

function sortNodesByF(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    if (
      neighbor.f === Infinity ||
      neighbor.f >
        node.g +
          1 +
          Math.abs(finishNode.row - neighbor.row) +
          Math.abs(finishNode.col - neighbor.col)
    ) {
      neighbor.f =
        node.g +
        1 +
        Math.abs(finishNode.row - neighbor.row) +
        Math.abs(finishNode.col - neighbor.col);
      neighbor.previousNode = node;
      neighbor.g = node.g + 1;
      neighbor.h =
        Math.abs(finishNode.row - neighbor.row) +
        Math.abs(finishNode.col - neighbor.col);
    }
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

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
