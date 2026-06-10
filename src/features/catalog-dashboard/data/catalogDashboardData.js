export const fallbackDashboardPayload = {
  success: true,
  result: {
    message: "Dashboard analytics fetched successfully",
    summary: {
      total_gaps: 2,
      critical_gaps: "0",
      high_gaps: "1",
      medium_gaps: "1",
      low_gaps: "0",
      open_gaps: "2",
      in_review_gaps: "0",
      resolved_gaps: "0",
      affected_skus: 2,
      categories: 2,
      total_query_frequency: "2",
      avg_confidence: "0.9643",
      total_suggestions: 2,
      pending_reviews: "2",
      approved_suggestions: "0",
      rejected_suggestions: "0"
    },
    graph_data: {
      gap_by_category: [
        {
          category: "Accessories",
          count: 1,
          total_frequency: "1",
          critical_count: "0",
          high_count: "1",
          avg_confidence: "0.984"
        },
        {
          category: "Laptops",
          count: 1,
          total_frequency: "1",
          critical_count: "0",
          high_count: "0",
          avg_confidence: "0.945"
        }
      ],
      priority_distribution: [
        {
          priority: "HIGH",
          count: 1,
          total_frequency: "1",
          avg_confidence: "0.984"
        },
        {
          priority: "MEDIUM",
          count: 1,
          total_frequency: "1",
          avg_confidence: "0.945"
        }
      ],
      gap_frequency_by_attribute: [
        {
          missing_attribute: "battery_life",
          attribute_category: "Power",
          query_frequency: "1",
          affected_skus: 1,
          avg_confidence: "0.984",
          critical_count: "0"
        },
        {
          missing_attribute: "weight_grams",
          attribute_category: "Other",
          query_frequency: "1",
          affected_skus: 1,
          avg_confidence: "0.945",
          critical_count: "0"
        }
      ],
      suggestion_status: [
        {
          review_status: "PENDING_REVIEW",
          count: 2,
          avg_confidence: "0.964",
          latest_at: "2026-06-09T14:19:55"
        }
      ],
      confidence_distribution: [
        {
          bucket: "0.95-1.00",
          count: 1,
          range_min: "0.9840",
          range_max: "0.9840"
        },
        {
          bucket: "0.90-0.95",
          count: 1,
          range_min: "0.9446",
          range_max: "0.9446"
        }
      ]
    },
    heatmap: {
      CRITICAL: [],
      HIGH: [
        {
          id: 22,
          sku: "SKU_005",
          product_name: "TravelPad Compact Keyboard",
          category: "Accessories",
          brand: "Logitech",
          missing_attribute: "battery_life",
          attribute_category: "Power",
          query_frequency: 1,
          priority: "HIGH",
          confidence_score: "0.9840",
          gap_status: "OPEN",
          latest_search_query: "What is the battery life?",
          first_detected_at: "2026-06-01T15:49:03",
          last_detected_at: "2026-06-01T15:49:03",
          days_open: 8,
          pending_suggestions: 1
        }
      ],
      MEDIUM: [
        {
          id: 23,
          sku: "SKU_304",
          product_name: "GamingBeast 17 Laptop",
          category: "Laptops",
          brand: "ROG",
          missing_attribute: "weight_grams",
          attribute_category: "Other",
          query_frequency: 1,
          priority: "MEDIUM",
          confidence_score: "0.9446",
          gap_status: "OPEN",
          latest_search_query: "How much does this laptop weight?",
          first_detected_at: "2026-06-09T13:09:30",
          last_detected_at: "2026-06-09T13:09:30",
          days_open: 0,
          pending_suggestions: 1
        }
      ],
      LOW: []
    },
    top_skus: [
      {
        sku: "SKU_005",
        product_name: "TravelPad Compact Keyboard",
        category: "Accessories",
        brand: "Logitech",
        total_gaps: 1,
        total_frequency: "1",
        critical_count: "0",
        high_count: "1",
        last_activity: "2026-06-01T15:49:03"
      },
      {
        sku: "SKU_304",
        product_name: "GamingBeast 17 Laptop",
        category: "Laptops",
        brand: "ROG",
        total_gaps: 1,
        total_frequency: "1",
        critical_count: "0",
        high_count: "0",
        last_activity: "2026-06-09T13:09:30"
      }
    ],
    recent_gaps: [
      {
        sku: "SKU_304",
        product_name: "GamingBeast 17 Laptop",
        category: "Laptops",
        brand: "ROG",
        missing_attribute: "weight_grams",
        attribute_category: "Other",
        priority: "MEDIUM",
        query_frequency: 1,
        confidence_score: "0.9446",
        gap_status: "OPEN",
        latest_search_query: "How much does this laptop weight?",
        first_detected_at: "2026-06-09T13:09:30",
        last_detected_at: "2026-06-09T13:09:30"
      },
      {
        sku: "SKU_005",
        product_name: "TravelPad Compact Keyboard",
        category: "Accessories",
        brand: "Logitech",
        missing_attribute: "battery_life",
        attribute_category: "Power",
        priority: "HIGH",
        query_frequency: 1,
        confidence_score: "0.9840",
        gap_status: "OPEN",
        latest_search_query: "What is the battery life?",
        first_detected_at: "2026-06-01T15:49:03",
        last_detected_at: "2026-06-01T15:49:03"
      }
    ],
    pending_review: [
      {
        id: 1,
        sku: "SKU_005",
        product_name: "TravelPad Compact Keyboard",
        category: "Accessories",
        missing_attribute: "battery_life",
        query_frequency: 1,
        priority: "HIGH",
        suggested_attribute_value: "Up to 24 months",
        generation_confidence: "0.9840",
        llm_model: "gemini-2.5-flash",
        prompt_version: "v1",
        review_status: "PENDING_REVIEW",
        generated_at: "2026-06-08T16:55:14"
      },
      {
        id: 2,
        sku: "SKU_304",
        product_name: "GamingBeast 17 Laptop",
        category: "Laptops",
        missing_attribute: "weight_grams",
        query_frequency: 1,
        priority: "MEDIUM",
        suggested_attribute_value: "2950",
        generation_confidence: "0.9446",
        llm_model: "gemini-2.5-flash",
        prompt_version: "v1",
        review_status: "PENDING_REVIEW",
        generated_at: "2026-06-09T14:19:55"
      }
    ]
  }
};

export const tabs = [
  { id: "gaps", label: "Gap heatmap" },
  { id: "suggestions", label: "Description suggestions" },
  { id: "review", label: "Review queue" },
];

export const categories = ["Audio", "Display", "Performance", "Power", "Connectivity", "Durability", "Physical", "Input", "Storage"];
export const priorities = ["Critical", "High", "Medium", "Low"];
export const statuses = ["Pending review", "Approved", "Rejected"];
export const chartColors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#ff922b", "#ffd43b", "#51cf66", "#4dabf7"];
