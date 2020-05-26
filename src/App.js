import React, { useState } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuid } from 'uuid';
//rewards
const items = [
	{ id: uuid(), content: 'first reward' },
	{ id: uuid(), content: 'second reward' },
	{ id: uuid(), content: 'third reward' },
	{ id: uuid(), content: 'fourth reward' },
	{ id: uuid(), content: 'fifth reward' },
];

const allColumns = {
	[uuid()]: {
		name: 'Rewards',
		items: items,
	},
	[uuid()]: {
		name: 'Company 1',
		items: [],
	},
	[uuid()]: {
		name: 'Company 2',
		items: [],
	},
	[uuid()]: {
		name: 'Company 3',
		items: [],
	},
	[uuid()]: {
		name: 'Company 4',
		items: [],
	},
};

const onDragEnd = (result, columns, setColumns) => {
	if (!result.destination) return;

	const { source, destination } = result;
	if (source.droppableId != destination.droppableId) {
		const sourceColumn = columns[source.droppableId];
		const destColumn = columns[destination.droppableId];
		const sourceItems = [...sourceColumn.items];
		const destItems = [...destColumn.items];
		let remove = [];

		if (destColumn.name === 'Rewards') return;

		if (sourceColumn.name == 'Rewards') {
			let companyName = sourceItems.slice(source.index, source.index + 1)[0]
				.content;
			[remove] = [
				{
					id: uuid(),
					content: companyName,
				},
			];
		} else {
			[remove] = sourceItems.splice(source.index, 1);
		}
		destItems.splice(destination.index, 0, remove);

		setColumns({
			...columns,
			[source.droppableId]: {
				...sourceColumn,
				items: sourceItems,
			},
			[destination.droppableId]: {
				...destColumn,
				items: destItems,
			},
		});
	} else {
		const column = columns[source.droppableId];
		const copiedItems = [...column.items];
		const [remove] = copiedItems.splice(source.index, 1);
		copiedItems.splice(destination.index, 0, remove);
		setColumns({
			...columns,
			[source.droppableId]: { ...column, items: copiedItems },
		});
	}
};

const handleDelete = (column, item, columns, setColumns) => {
	const columnName = column.name;
	const itemId = item.id;
	const findColumn = Object.entries(columns).filter(
		(col) => col[1].name === columnName
	);

	const filteredColumn = findColumn[0][1].items.filter(
		(item) => item.id != itemId
	);

	setColumns({
		...columns,
		[findColumn[0][0]]: {
			...findColumn[0][1],
			items: filteredColumn,
		},
	});
};

function App() {
	const [columns, setColumns] = useState(allColumns);
	return (
		<div style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
			<DragDropContext
				onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
			>
				{Object.entries(columns).map(([id, column]) => {
					return (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
							}}
						>
							<h2>{column.name}</h2>
							<div style={{ margin: 8 }}>
								<Droppable droppableId={id} key={id}>
									{(provided, snapshot) => {
										return (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												style={{
													background: snapshot.isDraggingOver
														? 'lightblue'
														: 'lightgrey',
													padding: 3,
													width: 200,
													minHeight: 500,
												}}
											>
												{column.items.map((item, index) => {
													return (
														<Draggable
															key={item.id}
															draggableId={item.id}
															index={index}
														>
															{(provided, snapshot) => {
																return (
																	<div
																		ref={provided.innerRef}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																		style={{
																			position: 'relative',
																			userSelect: 'non',
																			padding: 16,
																			margin: '0 0 8px 0',
																			minHeight: '50px',
																			backgroundColor: snapshot.isDragging
																				? '#263B4A'
																				: '#456C86',
																			color: 'white',
																			...provided.draggableProps.style,
																		}}
																	>
																		{item.content}

																		{column.name === 'Rewards' ? null : (
																			<button
																				onClick={(e) =>
																					handleDelete(
																						column,
																						item,
																						columns,
																						setColumns
																					)
																				}
																				style={{
																					position: 'absolute',
																					userSelect: 'non',
																					padding: 10,
																					right: 10,
																					minHeight: '3px',
																					color: 'black',
																					border: 'none',
																					borderRadius: 30,
																				}}
																			>
																				❌
																			</button>
																		)}
																	</div>
																);
															}}
														</Draggable>
													);
												})}
												{provided.placeholder}
											</div>
										);
									}}
								</Droppable>
							</div>
						</div>
					);
				})}
			</DragDropContext>
		</div>
	);
}

export default App;
