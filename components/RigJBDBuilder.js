
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { JBDPreviewDocument } from './JBDPreviewDocument';


import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#FFD433'];
const RIG_OPTIONS = ['DAT', 'DGD', 'DPN', 'DPS', 'DPT', 'DTH', 'DTN', 'DVS'];

export default function RigJBDBuilder() {
  const [operation, setOperation] = useState('');
  const [rig, setRig] = useState('DAT');
  const [pic, setPic] = useState('');
  const [lofHazard, setLofHazard] = useState('');
  const [diagram, setDiagram] = useState('Drillfloor');


  const diagramOptions = {
    DAT: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DGD: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DPN: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DPS: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DPT: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DTH: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DTN: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"],
    DVS: ["Pipe Deck", "Rig Floor", "Riser Deck", "Helideck Deck"]
  };

  const getDiagramFileName = (rig, diagram) => `${rig}_${diagram.replace(/\s+/g, '_')}.jpg`;

  const [personnel, setPersonnel] = useState([]);
  const [newPerson, setNewPerson] = useState('');
  const [personPositions, setPersonPositions] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskPersons, setTaskPersons] = useState([]);
  const [zones, setZones] = useState([]);
  const [arrows, setArrows] = useState([]);

  const addPerson = () => {
    if (newPerson.trim()) {
      const color = COLORS[personnel.length % COLORS.length];
      setPersonnel([...personnel, { name: newPerson, color }]);
      setNewPerson('');
    }
  };

  const addTask = () => {
    if (newTask.trim() && taskPersons.length) {
      setTasks([...tasks, { step: newTask, persons: taskPersons }]);
      setNewTask('');
      setTaskPersons([]);
    }
  };

  const updatePosition = (index, data) => {
    setPersonPositions({ ...personPositions, [index]: { x: data.x, y: data.y } });
  };

  const addZone = (color) => {
    setZones([...zones, { id: Date.now(), x: 50, y: 50, w: 100, h: 100, color }]);
  };

  const updateZone = (id, newProps) => {
    setZones(zones.map(z => z.id === id ? { ...z, ...newProps } : z));
  };

  const deleteZone = (id) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const addArrow = (rotation) => {
    setArrows([...arrows, { id: Date.now(), x: 50, y: 50, w: 50, h: 10, rotate: rotation }]);
  };

  const updateArrow = (id, newProps) => {
    setArrows(arrows.map(a => a.id === id ? { ...a, ...newProps } : a));
  };

  const deleteArrow = (id) => {
    setArrows(arrows.filter(a => a.id !== id));
  };

  
  const deletePersonnel = (index) => {
    const newPersonnel = personnel.filter((_, i) => i !== index);
    const newPositions = { ...personPositions };
    delete newPositions[index];
    setPersonnel(newPersonnel);
    setPersonPositions(newPositions);
  };

  const deleteTaskStep = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const moveTask = (from, to) => {
    if (to < 0 || to >= tasks.length) return;
    const updated = [...tasks];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setTasks(updated);
  };

  return (
    <div style={{ width: '800px', backgroundColor: '#00587C', color: 'white', padding: '20px', fontFamily: 'Quantico' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/Transocean Logo_White.png" alt="Transocean" style={{ width: '300px', height: '100px' }} />
        <div style={{ width: '10px' }}></div>
        <h1 style={{ fontSize: '38px', fontWeight: 'bold' }}>JBD Builder</h1>
      </div>
      <div style={{ width: '300px', height: '8px', backgroundColor: '#FFB511', margin: '10px 0' }}></div>

      <input placeholder="Operation" value={operation} onChange={e => setOperation(e.target.value)} style={{ width: '100%', margin: '5px 0' }} />
      <select value={rig} onChange={e => setRig(e.target.value)} style={{ width: '100%', margin: '5px 0' }}>
        {RIG_OPTIONS.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
<select value={diagram} onChange={e => setDiagram(e.target.value)} style={{ width: '100%', margin: '5px 0' }}>
          {diagramOptions[rig]?.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      <input placeholder="PIC" value={pic} onChange={e => setPic(e.target.value)} style={{ width: '100%', margin: '5px 0' }} />
      <textarea placeholder="Line of Fire Hazard" value={lofHazard} onChange={e => setLofHazard(e.target.value)} style={{ width: '100%', margin: '5px 0' }} />

      

      <div style={{ marginBottom: '10px' }}>
        <input placeholder="Add Personnel" value={newPerson} onChange={e => setNewPerson(e.target.value)} />
        <button onClick={addPerson}>Add</button>
        <ul>
          {personnel.map((p, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
              <div style={{ backgroundColor: p.color, width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px', textAlign: 'center' }}>{i + 1}</div>
              {p.name} <button onClick={() => deletePersonnel(i)} style={{ marginLeft: '5px' }}>❌</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <input placeholder="Task Step" value={newTask} onChange={e => setNewTask(e.target.value)} />
        <select multiple value={taskPersons} onChange={e => setTaskPersons(Array.from(e.target.selectedOptions, o => o.value))}>
  {personnel.map((p, i) => (
    <option key={i} value={p.name}>{p.name}</option>
  ))}
</select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div style={{ margin: '10px 0' }}>
        <button onClick={() => addZone('green')}>➕ Step Back Area</button>
        <button onClick={() => addZone('red')}>➕ Red Zone</button>
        <button onClick={() => addZone('black')}>➕ Black Zone</button>
        <button onClick={() => addArrow(0)}>➕ Horizontal Arrow</button>
        <button onClick={() => addArrow(90)}>➕ Vertical Arrow</button>
        <button onClick={() => addArrow(45)}>➕ 45° Left Arrow</button>
        <button onClick={() => addArrow(315)}>➕ 45° Right Arrow</button>
      </div>

      <div style={{ width: '800px', height: '600px', position: 'relative', backgroundColor: '#FFFFFF', color: 'black' }}>

          
          {zones.map(zone => (
            <Rnd
              key={zone.id}
              default={{ x: zone.x, y: zone.y, width: 100, height: 100 }}
              bounds="parent"
              onDragStop={(e, d) => updateZone(zone.id, { x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) =>
                updateZone(zone.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position
                })
              }
            >
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: zone.color,
                opacity: 0.3,
                border: `2px dashed ${zone.color}`,
                position: 'relative'
              }}>
                <button onClick={() => deleteZone(zone.id)} style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}>❌</button>
              </div>
            </Rnd>
          ))}
          {arrows.map(arrow => (
            <Rnd
              key={arrow.id}
              default={{ x: arrow.x, y: arrow.y, width: arrow.width, height: arrow.height }}
              bounds="parent"
              onDragStop={(e, d) => updateArrow(arrow.id, { x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) =>
                updateArrow(arrow.id, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  ...position
                })
              }
            >
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'blue',
                opacity: 0.4,
                transform: `rotate(${arrow.rotate}deg)`,
                position: 'relative'
              }}>
                <button onClick={() => deleteArrow(arrow.id)} style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}>❌</button>
              </div>
            </Rnd>
          ))}

          <img src={`/${getDiagramFileName(rig, diagram)}`} alt={diagram} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        {personnel.map((p, i) => (
          <Rnd
            key={i}
            size={{ width: 30, height: 30 }}
            position={personPositions[i] || { x: 0, y: 0 }}
            onDragStop={(e, d) => updatePosition(i, d)}
            style={{ backgroundColor: p.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
          >
            {i + 1}
          </Rnd>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <h3>Task Steps</h3>
        <ul>
          {tasks.map((t, i) => (
            <li key={i}>
              {i + 1}. {t.step} - Persons: {t.persons.join(', ')} <button onClick={() => deleteTaskStep(i)}>❌</button> <button onClick={() => moveTask(i, i - 1)}>⬆️</button> <button onClick={() => moveTask(i, i + 1)}>⬇️</button>
            </li>
          ))}
        </ul>
      </div>

      <button
        style={{ marginTop: '10px', padding: '10px', backgroundColor: '#FFB511', color: 'black' }}
        onClick={async () => {
          const doc = (
            <JBDPreviewDocument
              operation={operation}
              rig={rig}
              pic={pic}
              lofHazard={lofHazard}
              personnel={personnel}
              tasks={tasks}
            />
          );
          const blob = await pdf(doc).toBlob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'jbd_preview.pdf';
          a.click();
          a.remove();
        }}
      >
        Generate Preview
      </button>
    </div>
  );
}
