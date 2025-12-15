// controllers/ctaController.js
const CtaSection = require('../../models/home/ctaModel'); // Adjust path as needed
const dbConfig = require('../../config/database');
const { executeWithFallback, getDataWithCache, saveDataWithQueue } = require('../../utils/dbHelpers');

// Fallback data for demo mode
const fallbackCTAData = {
  id: 'main-cta',
  title: 'Transform Lives Through Education',
  description: 'Join us in making a difference. Your support helps provide quality education to underprivileged children.',
  primaryButton: {
    text: 'Donate Now',
    url: '/donate',
    style: 'bg-blue-600 hover:bg-blue-700 text-white'
  },
  secondaryButton: {
    text: 'Learn More',
    url: '/about',
    style: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600'
  },
  backgroundStyle: 'gradient',
  gradientFrom: '#3b82f6',
  gradientTo: '#8b5cf6',
  textColor: '#ffffff',
  enabled: true,
  animation: {
    title: 'fadeIn',
    description: 'fadeIn',
    buttons: 'fadeIn'
  }
};

exports.getCTASection = async (req, res) => {   
  try {
    const result = await getDataWithCache(
      () => CtaSection.findOne({ id: 'main-cta' }),
      fallbackCTAData,
      'cta_main',
      300000 // 5 minutes cache
    );
    
    if (!result) {
      return res.json({ success: true, data: fallbackCTAData });
    }
    
    res.json({ success: true, data: result });
  } catch (err) {     
    console.error('❌ Error fetching CTA:', err);     
    res.json({ success: true, data: fallbackCTAData });
  } 
}; 

exports.saveCTASection = async (req, res) => {
  try {
    console.log('Received CTA Data:', req.body);

    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const result = await saveDataWithQueue(
      async () => {
        // Check if already exists
        let cta = await CtaSection.findOne({ id });
        if (cta) {
          // Update if exists
          cta = await CtaSection.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true });
        } else {
          // Create new
          cta = new CtaSection(req.body);
          await cta.save();
        }
        return cta;
      },
      req.body,
      'CTA Section'
    );

    res.json({ success: true, message: 'CTA saved successfully', data: result.data || result });
  } catch (err) {
    console.error('Error saving CTA:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateCTASection = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const result = await saveDataWithQueue(
      async () => {
        const cta = await CtaSection.findOneAndUpdate(
          { id: id },
          updateData,
          { new: true, upsert: true }
        );
        return cta;
      },
      updateData,
      'CTA Section Update'
    );
    
    res.json({
      success: true,
      message: 'CTA section updated successfully',
      data: result.data || result
    });
  } catch (err) {
    console.error('Error updating CTA:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};