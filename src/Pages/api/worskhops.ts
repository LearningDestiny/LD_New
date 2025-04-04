import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

// Define the path for the workshops file
const workshopsFilePath = path.join(process.cwd(), 'src', 'pages', 'api', 'workshop.json');

// Define the Workshop interface
interface Workshop {
  id: string;
  title: string;
  date: string;
  price: string;
  duration: string;
  description: string;
  summaryDescription: string;
  imageUrl: string;
  highlights: string[];
  location: string;
  organizer: string;
}

// Helper function to read workshops from the file
async function readWorkshopsFile(): Promise<Workshop[]> {
  try {
    const data = await fs.readFile(workshopsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading workshops file:', error);
    throw new Error('Error reading workshops data');
  }
}

// Helper function to write workshops to the file
async function writeWorkshopsFile(workshops: Workshop[]): Promise<void> {
  try {
    await fs.writeFile(workshopsFilePath, JSON.stringify(workshops, null, 2));
  } catch (error) {
    console.error('Error writing workshops file:', error);
    throw new Error('Error writing workshops data');
  }
}

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const workshops = await readWorkshopsFile();
        res.status(200).json(workshops);
        break;
      }

      case 'POST': {
        const newWorkshop: Workshop = { ...req.body, id: Date.now().toString() };
        const workshopsWithNew = await readWorkshopsFile();
        workshopsWithNew.push(newWorkshop);
        await writeWorkshopsFile(workshopsWithNew);
        res.status(201).json(newWorkshop);
        break;
      }

      case 'PUT': {
        const updatedWorkshop: Workshop = req.body;
        const workshopsToUpdate = await readWorkshopsFile();
        const updateIndex = workshopsToUpdate.findIndex((w) => w.id === updatedWorkshop.id);

        if (updateIndex !== -1) {
          workshopsToUpdate[updateIndex] = updatedWorkshop;
          await writeWorkshopsFile(workshopsToUpdate);
          res.status(200).json(updatedWorkshop);
        } else {
          res.status(404).json({ message: 'Workshop not found' });
        }
        break;
      }

      case 'DELETE': {
        const { id } = req.query;

        if (typeof id !== 'string') {
          res.status(400).json({ message: 'Invalid workshop ID' });
          break;
        }

        const workshopsToFilter = await readWorkshopsFile();
        const filteredWorkshops = workshopsToFilter.filter((w) => w.id !== id);

        if (workshopsToFilter.length !== filteredWorkshops.length) {
          await writeWorkshopsFile(filteredWorkshops);
          res.status(200).json({ message: 'Workshop deleted successfully' });
        } else {
          res.status(404).json({ message: 'Workshop not found' });
        }
        break;
      }

      default: {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
      }
    }
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
