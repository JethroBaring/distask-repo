import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import mockData from '../../mockData';
import { useState } from 'react';
import Card from '../../components/Card';
import { useParams } from 'react-router-dom';
export const Tasks = () => {
  const [data, setData] = useState(mockData);
  const { id } = useParams()
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const destinationColIndex = data.findIndex(
        (e) => e.id === destination.droppableId
      );

      const sourceCol = data[sourceColIndex];
      const destinationCol = data[destinationColIndex];

      const sourceTask = [...sourceCol.tasks];
      const destinationTask = [...destinationCol.tasks];

      const [removed] = sourceTask.splice(source.index, 1);
      console.log(removed)
      console.log(data[destinationColIndex].title)
      destinationTask.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTask;
      data[destinationColIndex].tasks = destinationTask;

      setData(data);
    } else {
      const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
      const sourceCol = data[sourceColIndex];

      // Remove the item from the source tasks array
      const [removed] = sourceCol.tasks.splice(source.index, 1);

      // Insert the removed item into the destination tasks array at the destination index
      sourceCol.tasks.splice(destination.index, 0, removed);

      // Update the state with the modified data
      setData([...data]);
    }
}
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='flex gap-6 h-full pl-6 pr-6 pb-6'>
          {data.map((section) => (
            <Droppable key={section.id} droppableId={section.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  className='flex-1 flex flex-col gap-3 rounded-lg'
                  ref={provided.innerRef}
                >
                  <div className=''>{section.title}</div>
                  <div className='flex flex-col gap-3'>
                    {section.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? '0.5' : '1',
                            }}
                          >
                            <Card>
                                <div>{task.title}</div>
                                <div>Creator: Jethro Baring</div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      /* <DragDropContext onDragEnd={onDragEnd}>
    <div className='flex gap-6 h-full pl-6 pr-6 pb-6'>
        {data.map((section) => {
            <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                    <div className='flex-1 flex flex-col gap-3 bg-blue-500 rounded-lg p-3'>
                    <h1>Pending</h1>
                    <div className='flex flex-col gap-3'>

                   {section.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                             <div  ref={provided.innerRef}
                                                       {...provided.draggableProps}
                                                       {...provided.dragHandleProps} className='bg-red-500 rounded-lg h-36'>{task.title}</div>
                        )}
                    </Draggable>
                   ))}
                                              </div>

                  </div>
                )}
            </Droppable>
        })}
    </div>
</DragDropContext> */

      // <div className='flex gap-6 h-full pl-6 pr-6 pb-6'>
      //   <div className='flex-1 flex flex-col gap-3 bg-blue-500 rounded-lg p-3'>
      //     <h1>Pending</h1>
      //     <div className='flex flex-col gap-3'>
      //       <div className='bg-red-500 rounded-lg h-36'></div>
      //     </div>
      //   </div>
      //   <div className='flex-1 bg-blue-500 rounded-lg p-3'></div>
      //   <div className='flex-1 bg-blue-500 rounded-lg p-3'></div>
      // </div>

      // <DragDropContext onDragEnd={onDragEnd}>
      //       <div className='kanban'>
      //         {data.map((section) => (
      //           <Droppable key={section.id} droppableId={section.id}>
      //             {(provided) => (
      //               <div
      //                 {...provided.droppableProps}
      //                 className='kanban__section'
      //                 ref={provided.innerRef}
      //               >
      //                 <div className='kanban__section__title'>{section.title}</div>
      //                 <div className='kanban__section__content'>
      //                   {section.tasks.map((task, index) => (
      //                     <Draggable
      //                       key={task.id}
      //                       draggableId={task.id}
      //                       index={index}
      //                     >
      //                       {(provided, snapshot) => (
      //                         <div
      //                           ref={provided.innerRef}
      //                           {...provided.draggableProps}
      //                           {...provided.dragHandleProps}
      //                           style={{
      //                             ...provided.draggableProps.style,
      //                             opacity: snapshot.isDragging ? '0.5' : '1',
      //                           }}
      //                         >
      //                           <Card>{task.title}</Card>
      //                         </div>
      //                       )}
      //                     </Draggable>
      //                   ))}
      //                   {provided.placeholder}
      //                 </div>
      //               </div>
      //             )}
      //           </Droppable>
      //         ))}
      //       </div>
      //     </DragDropContext>
    );
  };
